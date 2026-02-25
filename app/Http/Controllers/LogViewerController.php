<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;

class LogViewerController extends Controller
{
    /**
     * Display the logs page with list of log files and their contents.
     */
    public function index(Request $request)
    {
        try {
            $logDirectory = storage_path('logs');
            $files = File::files($logDirectory);
            
            $logFiles = [];
            foreach ($files as $file) {
                if (pathinfo($file->getFilename(), PATHINFO_EXTENSION) === 'log') {
                    $logFiles[] = [
                        'name' => $file->getFilename(),
                        'path' => $file->getPathname(),
                        'size' => $file->getSize(),
                        'modified' => date('Y-m-d H:i:s', $file->getMTime()),
                    ];
                }
            }
            
            // Sort by modification time, newest first
            usort($logFiles, function ($a, $b) {
                return strtotime($b['modified']) - strtotime($a['modified']);
            });

            $selectedFile = $request->get('file');
            $logs = [];
            $search = $request->get('search', '');
            $level = $request->get('level', '');
            
            if ($selectedFile) {
                $filePath = $logDirectory . '/' . basename($selectedFile);
                if (file_exists($filePath) && is_readable($filePath)) {
                    $content = file_get_contents($filePath);
                    $lines = explode("\n", trim($content));
                    
                    // Group multi-line log entries together
                    $groupedLogs = $this->groupLogEntries($lines);
                    
                    // Reverse to show newest first
                    $groupedLogs = array_reverse($groupedLogs);
                    
                    foreach ($groupedLogs as $logEntry) {
                        if (empty(trim($logEntry))) continue;
                        
                        // Parse log line
                        $parsed = $this->parseLogLine($logEntry);
                        
                        // Apply filters
                        if ($level && $parsed['level'] !== strtoupper($level)) {
                            continue;
                        }
                        
                        if ($search && stripos($logEntry, $search) === false) {
                            continue;
                        }
                        
                        $logs[] = $parsed;
                        
                        // Limit to 500 lines for performance
                        if (count($logs) >= 500) break;
                    }
                }
            }

            return Inertia::render('admin/Logs', [
                'auth' => [
                    'user' => $request->user(),
                ],
                'logFiles' => $logFiles,
                'logs' => $logs,
                'selectedFile' => $selectedFile,
                'filters' => [
                    'search' => $search,
                    'level' => $level,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Log viewer failed: ' . $e->getMessage());
            return Inertia::render('admin/Logs', [
                'auth' => [
                    'user' => $request->user(),
                ],
                'logFiles' => [],
                'logs' => [],
                'selectedFile' => null,
                'filters' => [
                    'search' => '',
                    'level' => '',
                ],
                'error' => 'Failed to load logs: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Group multi-line log entries together.
     * Laravel log entries with stack traces span multiple lines.
     */
    private function groupLogEntries($lines)
    {
        $grouped = [];
        $currentEntry = '';

        foreach ($lines as $line) {
            // Check if this line starts a new log entry (has timestamp at the beginning)
            if (preg_match('/^\[\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\]/', $line)) {
                // If we have a previous entry, save it
                if (!empty(trim($currentEntry))) {
                    $grouped[] = $currentEntry;
                }
                // Start a new entry
                $currentEntry = $line;
            } else {
                // Continue the current entry (this is a stack trace line)
                if (!empty($currentEntry)) {
                    $currentEntry .= "\n" . $line;
                }
            }
        }

        // Don't forget the last entry
        if (!empty(trim($currentEntry))) {
            $grouped[] = $currentEntry;
        }

        return $grouped;
    }

    /**
     * Parse a log line to extract level, message, and timestamp.
     */
    private function parseLogLine($line)
    {
        $result = [
            'raw' => $line,
            'level' => 'INFO',
            'message' => $line,
            'timestamp' => '',
        ];

        // Try to extract log level - handle format like "local.ERROR" or just "ERROR"
        if (preg_match('/\b(DEBUG|INFO|WARNING|ERROR|CRITICAL|ALERT|EMERGENCY)\b/i', $line, $matches)) {
            $result['level'] = strtoupper($matches[1]);
        }

        // Try to extract timestamp
        if (preg_match('/^\[(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\]/', $line, $matches)) {
            $result['timestamp'] = $matches[1];
        }

        return $result;
    }

    /**
     * Download a specific log file.
     */
    public function download(Request $request, $filename)
    {
        try {
            $filePath = storage_path('logs/' . basename($filename));
            
            if (!file_exists($filePath)) {
                return back()->with('error', 'Log file not found');
            }

            return response()->download($filePath);
        } catch (\Throwable $e) {
            Log::error('Download log failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to download log file');
        }
    }

    /**
     * Clear a specific log file.
     */
    public function clear(Request $request, $filename)
    {
        try {
            $filePath = storage_path('logs/' . basename($filename));
            
            if (!file_exists($filePath)) {
                return back()->with('error', 'Log file not found');
            }

            file_put_contents($filePath, '');
            
            return back()->with('success', 'Log file cleared successfully');
        } catch (\Throwable $e) {
            Log::error('Clear log failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to clear log file');
        }
    }

    /**
     * Clear all log files.
     */
    public function clearAll(Request $request)
    {
        try {
            $logDirectory = storage_path('logs');
            $files = File::files($logDirectory);
            
            foreach ($files as $file) {
                if (pathinfo($file->getFilename(), PATHINFO_EXTENSION) === 'log') {
                    file_put_contents($file->getPathname(), '');
                }
            }
            
            return back()->with('success', 'All log files cleared successfully');
        } catch (\Throwable $e) {
            Log::error('Clear all logs failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to clear log files');
        }
    }
}
