@props(['href' => '#', 'active' => false, 'mobile' => false])

@php
$classes = $active 
    ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-600 bg-blue-50'
    : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100';

if ($mobile) {
    $classes = $active 
        ? 'flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-blue-600 bg-blue-50'
        : 'flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100';
}
@endphp

<a href="{{ $href }}" {{ $attributes->class($classes) }}>
    {{ $slot }}
</a>
