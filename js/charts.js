/**
 * Charts utility for BigDesk.
 * @author Lukas Vlcek (twitter: @lukasvlcek)
 */
;
var chartsBuilder = (function() {

    var buildChJvmThreads = function(renderTo) {
        return new Highcharts.Chart({
            chart: {
                renderTo: renderTo,
                defaultSeriesType: 'line',
                marginRight: 10
            },
            title: {
                text: 'Threads'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Count'
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }
                ]
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.series.name + '</b><br/>' +
                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                            Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: true
            },
            exporting: {
                enabled: false
            },
            series: [
                { name: 'count' },
                { name: 'peak count' }
            ]
        });
    };

    var buildChJvmMem = function(renderTo, title) {
        return new Highcharts.Chart({
            chart: {
                renderTo: renderTo,
                defaultSeriesType: 'area'
            },
            title: {
                text: title
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'MegaBytes'
                },
                labels: {
                    formatter: function() {
                        var res = this.value / 1024000;
                        res = Math.round(res * Math.pow(10, 2)) / Math.pow(10, 2);
                        return res;
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    return '' +
                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + ': ' +
                            Highcharts.numberFormat(this.y / 1024000, 1) + 'mb';
                }
            },
            plotOptions: {
                area: {
                    //            stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                    //            marker: {
                    //               lineWidth: 1,
                    //               lineColor: '#666666'
                    //            }
                }
            },
            series: [
                { name: 'Heap Allocated' },
                { name: 'Heap Used' }
            ]
        });
    };

    var buildChOsCpu = function(renderTo) {
        return new Highcharts.Chart({
            chart: {
                renderTo: renderTo,
                defaultSeriesType: 'area',
                marginRight: 10
            },
            title: {
                text: 'CPU(%)'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Percent'
                }
            },
            tooltip: {
                formatter: function() {
                    return '' +
                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + ': ' +
                            Highcharts.numberFormat(this.percentage, 1) + '%';
                }
            },
            plotOptions: {
                area: {
                    stacking: 'percent',
                    lineColor: '#ffffff',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#ffffff'
                    }
                }
            },
            series: [
                { name: 'Idle' },
                { name: 'Sys' },
                { name: 'User' }
            ]
        });
    };

    var buildChOsSwap = function(renderTo, title) {
        return new Highcharts.Chart({
            chart: {
                renderTo: renderTo,
                defaultSeriesType: 'area'
            },
            title: {
                text: title
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'MegaBytes'
                },
                labels: {
                    formatter: function() {
                        var res = this.value / 1024000;
                        res = Math.round(res * Math.pow(10, 2)) / Math.pow(10, 2);
                        return res;
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    return '' +
                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + ': ' +
                            Highcharts.numberFormat(this.y / 1024000, 1) + 'mb';
                }
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                    //            marker: {
                    //               lineWidth: 1,
                    //               lineColor: '#666666'
                    //            }
                }
            },
            series: [
                { name: 'Free' },
                { name: 'Used' }
            ]
        });
    };

    var buildChOsMem = function(renderTo) {
        return new Highcharts.Chart({
            chart: {
                renderTo: renderTo,
                defaultSeriesType: 'area'
            },
            title: {
                text: "Mem"
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'MegaBytes'
                },
                labels: {
                    formatter: function() {
                        var res = this.value / 1024000;
                        res = Math.round(res * Math.pow(10, 2)) / Math.pow(10, 2);
                        return res;
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    return '' +
                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + ': ' +
                            Highcharts.numberFormat(this.y / 1024000, 1) + 'mb';
                }
            },
            plotOptions: {
                area: {
                    //            stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                    //            marker: {
                    //               lineWidth: 1,
                    //               lineColor: '#666666'
                    //            }
                }
            },
            series: [
                { name: 'Total Mem' },
                { name: 'Used' },
                { name: 'Actual Used' }
            ]
        });
    };

    return {
        buildChJvmThreads : buildChJvmThreads,
        buildChJvmMem : buildChJvmMem,
        buildChOsCpu : buildChOsCpu,
        buildChOsMem : buildChOsMem,
        buildChOsSwap : buildChOsSwap
    }
})();