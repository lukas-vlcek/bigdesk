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
                borderWidth: 1,
                borderColor: '#E1EDB9',
                plotBackgroundColor: '#FCFFE5',
                marginRight: 105,
                marginBottom: 30,
                marginTop: 35,
                spacingTop: 0,
                spacingRight: 0,
                spacingBottom: 0
            },
            title: {
                text: 'Threads'
            },
            plotOptions: {
                series: {
                    lineWidth: 0.5,
                    marker: { radius: 2 }
                }
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
                enabled: true,
                align: 'right',
                layout: 'vertical',
                verticalAlign: 'bottom',
                borderWidth: 0,
                x: -5,
                y: -32
            },
            exporting: {
                enabled: false
            },
            series: [
                { name: 'count' },
                { name: 'peak cnt' }
            ]
        });
    };

    var buildChJvmHeapMem = function(renderTo, title) {
        return new Highcharts.Chart({
            chart: {
                renderTo: renderTo,
                defaultSeriesType: 'area',
                borderWidth: 1,
                borderColor: '#E1EDB9',
                plotBackgroundColor: '#FCFFE5',
                marginRight: 105,
                marginBottom: 30,
                marginTop: 35,
                spacingTop: 0,
                spacingRight: 0,
                spacingBottom: 0
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
                }
            },
            legend: {
                enabled: true,
                align: 'right',
                layout: 'vertical',
                verticalAlign: 'bottom',
                borderWidth: 0,
                x: -5,
                y: -32
            },
            series: [
                { name: 'allocated' },
                { name: 'used' }
            ]
        });
    };

    var buildChJvmNonHeapMem = function(renderTo, title) {
        return new Highcharts.Chart({
            chart: {
                renderTo: renderTo,
                defaultSeriesType: 'area',
                borderWidth: 1,
                borderColor: '#E1EDB9',
                plotBackgroundColor: '#FCFFE5',
                marginRight: 105,
                marginBottom: 30,
                marginTop: 35,
                spacingTop: 0,
                spacingRight: 0,
                spacingBottom: 0
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
                }
            },
            legend: {
                enabled: true,
                align: 'right',
                layout: 'vertical',
                verticalAlign: 'bottom',
                borderWidth: 0,
                x: -5,
                y: -32
            },
            series: [
                { name: 'allocated' },
                { name: 'used' }
            ]
        });
    };

    var buildChOsCpu = function(renderTo) {
        return new Highcharts.Chart({
            chart: {
                renderTo: renderTo,
                defaultSeriesType: 'area',
                borderWidth: 1,
                borderColor: '#E1EDB9',
                plotBackgroundColor: '#FCFFE5',
                marginRight: 105,
                marginBottom: 30,
                marginTop: 35,
                spacingTop: 0,
                spacingRight: 0,
                spacingBottom: 0
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
            legend: {
                enabled: true,
                align: 'right',
                layout: 'vertical',
                verticalAlign: 'bottom',
                borderWidth: 0,
                x: -30,
                y: -32
            },
            series: [
                { name: 'idle' },
                { name: 'sys' },
                { name: 'user' }
            ]
        });
    };

    var buildChOsSwap = function(renderTo, title) {
        return new Highcharts.Chart({
            chart: {
                renderTo: renderTo,
                defaultSeriesType: 'area',
                borderWidth: 1,
                borderColor: '#E1EDB9',
                plotBackgroundColor: '#FCFFE5',
                marginRight: 105,
                marginBottom: 30,
                marginTop: 35,
                spacingTop: 0,
                spacingRight: 0,
                spacingBottom: 0
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
                }
            },
            legend: {
                enabled: true,
                align: 'right',
                layout: 'vertical',
                verticalAlign: 'bottom',
                borderWidth: 0,
                x: -20,
                y: -32
            },
            series: [
                { name: 'free' },
                { name: 'used' }
            ]
        });
    };

    var buildChOsMem = function(renderTo) {
        return new Highcharts.Chart({
            chart: {
                renderTo: renderTo,
                defaultSeriesType: 'area',
                borderWidth: 1,
                borderColor: '#E1EDB9',
                plotBackgroundColor: '#FCFFE5',
                marginRight: 105,
                marginBottom: 30,
                marginTop: 35,
                spacingTop: 0,
                spacingRight: 0,
                spacingBottom: 0
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
                }
            },
            legend: {
                enabled: true,
                align: 'right',
                layout: 'vertical',
                verticalAlign: 'bottom',
                borderWidth: 0,
                x: -20,
                y: -32
            },
            series: [
                { name: 'total' },
                { name: 'used' },
                { name: 'actual' }
            ]
        });
    };

    return {
        buildChJvmThreads : buildChJvmThreads,
        buildChJvmHeapMem : buildChJvmHeapMem,
        buildChJvmNonHeapMem : buildChJvmNonHeapMem,
        buildChOsCpu : buildChOsCpu,
        buildChOsMem : buildChOsMem,
        buildChOsSwap : buildChOsSwap
    }
})();