var app = {};
var ROOT_PATH = 'https://echarts.apache.org/examples';
var option;

var _panelImageURL = ROOT_PATH + '/data/asset/img/custom-gauge-panel.png';
var _animationDuration = 1000;
var _animationDurationUpdate = 1000;
var _animationEasingUpdate = 'quarticInOut';
var _valOnRadianMax = 100;
var _outerRadius = 50;
var _innerRadius = 42.5;
var _pointerInnerRadius = 10;
var _insidePanelRadius = 35;
var _currentDataIndex = 0;
function renderItem(params, api) {
  var valOnRadian = api.value(1);
  var coords = api.coord([api.value(0), valOnRadian]);
  var polarEndRadian = coords[3];
  var imageStyle = {
    image: _panelImageURL,
    x: params.coordSys.cx - _outerRadius,
    y: params.coordSys.cy - _outerRadius,
    width: _outerRadius * 2,
    height: _outerRadius * 2
  };
  return {
    type: 'group',
    children: [
      {
        type: 'image',
        style: imageStyle,
        clipPath: {
          type: 'sector',
          shape: {
            cx: params.coordSys.cx,
            cy: params.coordSys.cy,
            r: _outerRadius,
            r0: _innerRadius,
            startAngle: 0,
            endAngle: -polarEndRadian,
            transition: 'endAngle',
            enterFrom: { endAngle: 0 }
          }
        }
      },
      {
        type: 'image',
        style: imageStyle,
        clipPath: {
          type: 'polygon',
          shape: {
            points: makePionterPoints(params, polarEndRadian)
          },
          extra: {
            polarEndRadian: polarEndRadian,
            transition: 'polarEndRadian',
            enterFrom: { polarEndRadian: 0 }
          },
          during: function (apiDuring) {
            apiDuring.setShape(
              'points',
              makePionterPoints(params, apiDuring.getExtra('polarEndRadian'))
            );
          }
        }
      },
      {
        type: 'circle',
        shape: {
          cx: params.coordSys.cx,
          cy: params.coordSys.cy,
          r: _insidePanelRadius
        },
        style: {
          fill: '#fff',
          shadowBlur: 25,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: 'rgba(76,107,167,0.4)'
        }
      },
      {
        type: 'text',
        extra: {
          valOnRadian: valOnRadian,
          transition: 'valOnRadian',
          enterFrom: { valOnRadian: 0 }
        },
        style: {
          text: makeText(valOnRadian),
          fontSize: 25,
          fontWeight: 700,
          x: params.coordSys.cx,
          y: params.coordSys.cy,
          fill: 'rgb(0,50,190)',
          align: 'center',
          verticalAlign: 'middle',
          enterFrom: { opacity: 0 }
        },
        during: function (apiDuring) {
          apiDuring.setStyle(
            'text',
            makeText(apiDuring.getExtra('valOnRadian'))
          );
        }
      }
    ]
  };
}
function convertToPolarPoint(renderItemParams, radius, radian) {
  return [
    Math.cos(radian) * radius + renderItemParams.coordSys.cx,
    -Math.sin(radian) * radius + renderItemParams.coordSys.cy
  ];
}
function makePionterPoints(renderItemParams, polarEndRadian) {
  return [
    convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian),
    convertToPolarPoint(
      renderItemParams,
      _outerRadius,
      polarEndRadian + Math.PI * 0.03
    ),
    convertToPolarPoint(renderItemParams, _pointerInnerRadius, polarEndRadian)
  ];
}
function makeText(valOnRadian) {
  // Validate additive animation calc.
  if (valOnRadian < -10) {
    alert('illegal during val: ' + valOnRadian);
  }
  return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
}
option = {
  animationEasing: _animationEasingUpdate,
  animationDuration: _animationDuration,
  animationDurationUpdate: _animationDurationUpdate,
  animationEasingUpdate: _animationEasingUpdate,
  dataset: {
    source: [[0,130]]
  },
  tooltip: {},
  angleAxis: {
    type: 'value',
    startAngle: 0,
    show: false,
    min: 0,
    max: _valOnRadianMax
  },
  radiusAxis: {
    type: 'value',
    show: false
  },
  polar: {},
  series: [
    {
      type: 'custom',
      coordinateSystem: 'polar',
      renderItem: renderItem
    }
  ]
};


/////////////////////////////////////////////////////////////////////////

var app = {};
var option;
option = {
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  title: {
    text: 'Patrón de comportamiento'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['D', 'I', 'S', 'C']
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['D', 'I', 'S', 'C']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'DISC',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(0, 221, 255)'
          },
          {
            offset: 1,
            color: 'rgb(77, 119, 255)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [20,82,11,34, 100]
    },
  ]
};


const getOptionChart2=()=>{
    console.log("Los datos DISC "+"D= "+D+" I= "+I+" S= "+S+" C= "+C)
    return {
      color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
      title: {
        text: 'Patrón de comportamiento'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['D', 'I', 'S', 'C']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['D', 'I', 'S', 'C']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'DISC',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 0
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(0, 221, 255)'
              },
              {
                offset: 1,
                color: 'rgb(77, 119, 255)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: [D,I,S,C, 8]
        },
      ]
    };
  };
  const getOptionChart1=()=>
  {
      console.log("Funcion de graficas lista");
    return {
      animationEasing: _animationEasingUpdate,
      animationDuration: _animationDuration,
      animationDurationUpdate: _animationDurationUpdate,
      animationEasingUpdate: _animationEasingUpdate,
      dataset: {
        source: [[0,porcentaje]]
      },
      tooltip: {},
      angleAxis: {
        type: 'value',
        startAngle: 0,
        show: false,
        min: 0,
        max: _valOnRadianMax
      },
      radiusAxis: {
        type: 'value',
        show: false
      },
      polar: {},
      series: [
        {
          type: 'custom',
          coordinateSystem: 'polar',
          renderItem: renderItem
        }
      ]
    };
  }; 








  const initCharts = () =>{
    const chart1= echarts.init(document.getElementById("chart1"))
    const chart2= echarts.init(document.getElementById("chart-container"))
    chart1.setOption(getOptionChart1());
    chart2.setOption(getOptionChart2());
   
    
  };