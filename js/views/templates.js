var templates = {

    selectedClusterNode : {

        selectedNodeInfoTemplate: [
            "<h2>Selected node:</h2>" +
                "Name: {{name}}",
            "ID: \"{{id}}\"",
            "Hostname: {{hostname}}"
        ].join("<br>"),

        selectedNodeHTTPTemplate: [
            "HTTP address: {{http_address}}",
            "",
            "Bound address: {{http.bound_address}}",
            "",
            "Publish address: {{http.publish_address}}"
        ].join("<br>"),

        selectedNodeTransportTemplate: [
            "Transport address: {{transport_address}}",
            "",
            "Bound address: {{transport.bound_address}}",
            "",
            "Publish address: {{transport.publish_address}}"
        ].join("<br>"),

        jvmHeapMem: [
            "<div>Committed: <span id='jvm_heap_mem_committed'>n/a</span></div>",
            "<div>Used: <span id='jvm_heap_mem_used'>n/a</span></div>"
        ].join(""),

        jvmNonHeapMem: [
            "<div>Committed: <span id='jvm_non_heap_mem_committed'>n/a</span></div>",
            "<div>Used: <span id='jvm_non_heap_mem_used'>n/a</span></div>"
        ].join(""),

        jvmThreads: [
            "<div>Peak: <span id='jvm_threads_peak'>n/a</span></div>",
            "<div>Count: <span id='jvm_threads_count'>n/a</span></div>"
        ].join(""),

        jvmGC: [
            "<div>Total time: <span id='jvm_gc_time'>n/a</span></div>",
            "<div>Total count: <span id='jvm_gc_count'>n/a</span></div>"
        ].join(""),

        fileDescriptorsTemplate: [
            "<div>Max: {{process.max_file_descriptors}}</div>",
            "<div>Open: <span id='open_file_descriptors'>n/a</span></div>"
//        "<div>Refresh interval: {{process.refresh_interval}}ms</div>"
        ].join(""),

        process_MemTemplate: [
            "<div>Total virtual: <span id='process_mem_total_virtual'>n/a</span></div>",
            "<div>Resident: <span id='process_mem_resident'>n/a</span></div>",
            "<div>Share: <span id='process_mem_share'>n/a</span></div>"
        ].join(""),

        process_CPU_timeTemplate: [
            "<div>Sys total: <span id='process_cpu_time_sys'>n/a</span></div>",
            "<div>User total: <span id='process_cpu_time_user'>n/a</span></div>"
        ].join(""),

        process_CPU_pctTemplate: [
            "<div>Total: <span id='process_cpu_pct_total'>n/a</span></div>",
            "<div>Process: <span id='process_cpu_pct_process'>n/a</span></div>"
        ].join(""),

        osCpu: [
            "<div>Total: 100%</div>",
            "<div>User: <span id='os_cpu_user'>n/a</span></div>",
            "<div>Sys: <span id='os_cpu_sys'>n/a</span></div>"
        ].join(""),

        osMem: [
            "<div>Free: <span id='os_mem_free'>n/a</span></div>",
            "<div>Used: <span id='os_mem_used'>n/a</span></div>"
        ].join(""),

        osSwap: [
            "<div>Free: <span id='os_swap_free'>n/a</span></div>",
            "<div>Used: <span id='os_swap_used'>n/a</span></div>"
        ].join(""),

        osLoad: [
            "<div>2: <span id='os_load_2'>n/a</span></div>",
            "<div>1: <span id='os_load_1'>n/a</span></div>",
            "<div>0: <span id='os_load_0'>n/a</span></div>"
        ].join(""),

        channelsTemplate: [
            "<div>Transport: <span id='open_transport_channels'>na</span></div>",
            "<div>HTTP: <span id='open_http_channels'>na</span></div>",
            "<div>HTTP total opened: <span id='total_opened_http_channels'>na</span></div>"
        ].join(""),

        TDBTemplate: [
            "<svg width='100%' height='90'>" +
                "<rect x='0' y='0' width='100%' height='100%' fill='#eee' stroke-width='1' />" +
                "</svg>"
        ].join(""),

        jvmInfoTemplate1: [
            "VM name: {{vm_name}}",
            "VM vendor: {{vm_vendor}}",
            "VM version: {{vm_version}}"
        ].join("<br>"),

        jvmInfoTemplate2: [
            "Uptime: <span id='jvm_uptime'>n/a</span>",
            "Java version: {{version}}",
            "PID: {{pid}}"
        ].join("<br>"),

        osInfoTemplate1: [
            "CPU vendor: {{cpu.vendor}}",
            "CPU model: {{cpu.model}} ({{cpu.mhz}} MHz)",
            "CPU total cores: {{cpu.total_cores}}",
            "CPU sockets: {{cpu.total_sockets}} with {{cpu.cores_per_socket}} cores each",
            "CPU cache: {{cpu.cache_size}}"
        ].join("<br>"),

        osInfoTemplate2: [
            "Uptime: <span id='os_uptime'>n/a</span>",
            "Refresh interval: {{refresh_interval}}ms",
            "Total mem: {{mem.total}} ({{mem.total_in_bytes}}&nbsp;b)",
            "Total swap: {{swap.total}} ({{swap.total_in_bytes}}&nbsp;b)"
        ].join("<br>"),

        indices1Template: [
            "Size: <span id='indices_store_size'>n/a</span>",
            "Docs count: <span id='indices_docs_count'>n/a</span>",
            "Docs deleted: <span id='indices_docs_deleted'>n/a</span>",
            "Flush: <span id='indices_flush_total'>n/a</span>",
            "Refresh: <span id='indices_refresh_total'>n/a</span>"
        ].join("<br>"),

        fsDataInfoTemplate: [
            "<div>Device: <span class='pre'>{{dev}}</span></div>",
            "<div>Mount: <span class='pre'>{{mount}}</span></div>",
            "<div>Path: <span class='pre'>{{path}}</span></div>",
            "<div>Free: <span id='fs_disk_free_{{key}}'>{{free}}</span></div>",
            "<div>Available: <span id='fs_disk_available_{{key}}'>{{available}}</span></div>",
            "<div>Total: {{total}}</div>"
        ].join(""),

        fsDataInfo_cntTemplate: [
            "<div>Writes: <span id='fs_disk_writes_{{key}}'>n/a</span></div>",
            "<div>Reads: <span id='fs_disk_reads_{{key}}'>n/a</span></div>"
        ].join(""),

        fsDataInfo_sizeTemplate: [
            "<div>Write: <span id='fs_disk_write_size_{{key}}'>n/a</span></div>",
            "<div>Read: <span id='fs_disk_read_size_{{key}}'>n/a</span></div>"
        ].join("")

    }

};
