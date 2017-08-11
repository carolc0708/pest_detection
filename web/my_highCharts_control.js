var temperatureChart, humidityChart;

$(document).ready(function () {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    temperatureChart = Highcharts.chart('temperatureChart', {
        chart: {
            type: 'x',
            backgroundColor: 'rgb(200, 200, 200)',
            animation: Highcharts.svg // don't animate in old IE
        },
        title: {
            text: 'Temperature Chart'
        },
        xAxis: {
			title: {
                text: 'Time'
            },
            type: 'datetime'
        },
        yAxis: {
            title: {
				text: 'Temperature(°C)'
			},
			labels: {
				formatter: function () {
					return this.value + '°';
				}
			},
			min: -10, 
			max: 50,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        
        legend: {
            enabled: false
        },
        backgroundColor: '#EEEEEE',
		plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[3]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[3]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
			color: Highcharts.getOptions().colors[3],
			type:'area',
            name: 'Random data',
            data: [],
            
        }]
    });
    
    humidityChart = Highcharts.chart('humidityChart', {
        chart: {
            type: 'x',
            backgroundColor:'rgb(200, 200, 200)',
            animation: Highcharts.svg // don't animate in old IE
        },
        title: {
            text: 'Relative Humidity Chart'
        },
        xAxis: {
			title: {
                text: 'Time'
            },
            type: 'datetime'
        },
        yAxis: {
            title: {
				text: 'Relative Humidity(%)'
			},
			labels: {
				formatter: function () {
					return this.value + '%';
				}
			},
			min: 0, 
			max: 100,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[1]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
			color: Highcharts.getOptions().colors[1],
			type:'area', 
            name: 'Random data',
            data: []
        }]
    });
    
    earthmoistureChart = Highcharts.chart('earthmoistureChart', {
        chart: {
            type: 'x',
            backgroundColor:'rgb(200, 200, 200)',
            animation: Highcharts.svg // don't animate in old IE
        },
        title: {
            text: 'Earth Relative Mositure Chart'
        },
        xAxis: {
			title: {
                text: 'Time'
            },
            type: 'datetime'
        },
        yAxis: {
            title: {
				text: 'Relative Mositure(%)'
			},
			labels: {
				formatter: function () {
					return this.value + '%';
				}
			},
			min: 0, 
			max: 100,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
			color: Highcharts.getOptions().colors[0],
			type:'area', 
            name: 'Random data',
            data: []
        }]
    });
});
