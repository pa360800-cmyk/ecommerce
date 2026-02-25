import { Head } from "@inertiajs/react";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";
import {
    Search,
    FileText,
    Download,
    Trash2,
    RefreshCw,
    AlertCircle,
    Info,
    AlertTriangle,
    XCircle,
    Clock,
} from "lucide-react";

export default function Logs() {
    const { auth, logFiles, logs, selectedFile, filters, error } =
        usePage().props;
    const [search, setSearch] = useState(filters.search || "");
    const [level, setLevel] = useState(filters.level || "");
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setIsLoading(true);
        router.get(
            route("admin.logs.index"),
            { file: selectedFile, search, level },
            { preserveState: true, onFinish: () => setIsLoading(false) },
        );
    };

    const handleFileSelect = (filename) => {
        setIsLoading(true);
        router.get(
            route("admin.logs.index"),
            { file: filename, search, level },
            { preserveState: true, onFinish: () => setIsLoading(false) },
        );
    };

    const handleClearFile = (filename) => {
        if (confirm("Are you sure you want to clear this log file?")) {
            router.delete(route("admin.logs.clear", { filename }), {
                onSuccess: () => {
                    router.reload({
                        only: ["logFiles", "logs", "selectedFile"],
                    });
                },
            });
        }
    };

    const handleClearAll = () => {
        if (confirm("Are you sure you want to clear all log files?")) {
            router.delete(route("admin.logs.clearAll"), {
                onSuccess: () => {
                    router.reload({
                        only: ["logFiles", "logs", "selectedFile"],
                    });
                },
            });
        }
    };

    const handleDownload = (filename) => {
        window.location.href = route("admin.logs.download", { filename });
    };

    const getLevelIcon = (level) => {
        const l = level.toUpperCase();
        switch (l) {
            case "ERROR":
            case "CRITICAL":
            case "EMERGENCY":
            case "ALERT":
                return <XCircle className="w-4 h-4 text-red-500" />;
            case "WARNING":
                return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            case "INFO":
                return <Info className="w-4 h-4 text-blue-500" />;
            case "DEBUG":
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
            default:
                return <FileText className="w-4 h-4 text-gray-400" />;
        }
    };

    const getLevelClass = (level) => {
        const l = level.toUpperCase();
        switch (l) {
            case "ERROR":
            case "CRITICAL":
            case "EMERGENCY":
            case "ALERT":
                return "bg-red-100 text-red-800";
            case "WARNING":
                return "bg-yellow-100 text-yellow-800";
            case "INFO":
                return "bg-blue-100 text-blue-800";
            case "DEBUG":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const user = auth?.user;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="System Logs" />

                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    System Logs
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    View and manage application logs
                                </p>
                            </div>
                            <button
                                onClick={handleClearAll}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear All Logs
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                                    <span className="text-red-700">
                                        {error}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Log Files List */}
                            <div className="lg:col-span-1 bg-white rounded-lg shadow border border-gray-200">
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="font-semibold text-gray-900">
                                        Log Files
                                    </h2>
                                </div>
                                <div className="p-2 max-h-[600px] overflow-y-auto">
                                    {logFiles.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500">
                                            No log files found
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {logFiles.map((file) => (
                                                <div
                                                    key={file.name}
                                                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                                        selectedFile ===
                                                        file.name
                                                            ? "bg-blue-50 border border-blue-200"
                                                            : "hover:bg-gray-50 border border-transparent"
                                                    }`}
                                                    onClick={() =>
                                                        handleFileSelect(
                                                            file.name,
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center min-w-0">
                                                            <FileText className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                            <span className="text-sm font-medium text-gray-900 truncate">
                                                                {file.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <button
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    handleDownload(
                                                                        file.name,
                                                                    );
                                                                }}
                                                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                                title="Download"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    handleClearFile(
                                                                        file.name,
                                                                    );
                                                                }}
                                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                                title="Clear"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 flex items-center text-xs text-gray-500">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        <span className="mr-3">
                                                            {file.modified}
                                                        </span>
                                                        <span>
                                                            {formatFileSize(
                                                                file.size,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Log Content */}
                            <div className="lg:col-span-3 bg-white rounded-lg shadow border border-gray-200">
                                {/* Filters */}
                                <div className="p-4 border-b border-gray-200">
                                    <form
                                        onSubmit={handleSearch}
                                        className="flex flex-col sm:flex-row gap-3"
                                    >
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search logs..."
                                                    value={search}
                                                    onChange={(e) =>
                                                        setSearch(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:w-40">
                                            <select
                                                value={level}
                                                onChange={(e) =>
                                                    setLevel(e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">
                                                    All Levels
                                                </option>
                                                <option value="debug">
                                                    Debug
                                                </option>
                                                <option value="info">
                                                    Info
                                                </option>
                                                <option value="warning">
                                                    Warning
                                                </option>
                                                <option value="error">
                                                    Error
                                                </option>
                                                <option value="critical">
                                                    Critical
                                                </option>
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                "Filter"
                                            )}
                                        </button>
                                    </form>
                                </div>

                                {/* Log Entries */}
                                <div className="p-4 max-h-[500px] overflow-y-auto">
                                    {!selectedFile ? (
                                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                            <FileText className="w-12 h-12 mb-2" />
                                            <p>
                                                Select a log file to view its
                                                contents
                                            </p>
                                        </div>
                                    ) : logs.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                            <FileText className="w-12 h-12 mb-2" />
                                            <p>No log entries found</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {logs.map((log, index) => (
                                                <div
                                                    key={index}
                                                    className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-shrink-0 mt-0.5">
                                                            {getLevelIcon(
                                                                log.level,
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span
                                                                    className={`text-xs font-medium px-2 py-0.5 rounded ${getLevelClass(
                                                                        log.level,
                                                                    )}`}
                                                                >
                                                                    {log.level}
                                                                </span>
                                                                {log.timestamp && (
                                                                    <span className="text-xs text-gray-500">
                                                                        {
                                                                            log.timestamp
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <pre className="text-sm text-gray-700 whitespace-pre-wrap break-all font-mono">
                                                                {log.raw}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                {logs.length > 0 && (
                                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                                        <p className="text-sm text-gray-500 text-center">
                                            Showing {logs.length} log entries
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
