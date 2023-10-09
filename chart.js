{
  const chartId = `#${document.currentScript.getAttribute('chartId')}`;

  const stream = fc.randomFinancial().stream();
  const data = stream.take(3000).map(x => ({
      y: x.high,
      x: x.date
    }));

  const crossHairValues = []
  const xExtent = fc.extentDate().accessors([d => d.x]);

  const yExtent = fc.extentLinear().accessors([d => d.y]);

  const series = fc
    .seriesWebglLine()
    .crossValue(d => d.x)
    .mainValue(d => d.y)

  // show a crosshair cursor on hover
  const crossHair = fc.annotationSvgCrosshair()
    .xLabel(d => yScale.invert(d.y).toLocaleString())
    .decorate(s => {
      s.select(".point")
        .style("stroke", "rgba(100, 0, 0, 0.5)")
        .style("fill", "rgba(100, 0, 0, 0.5)");
    });

  const gridlines = fc.annotationCanvasGridline();
  const multi = fc.seriesSvgMulti().series([gridlines, series, crossHair])
  .mapping((data, index, series) =>
      (index === 0) ? data : crossHairValues);;

  const chart = fc
      .chartCartesian(d3.scaleTime(), d3.scaleLinear())
      .yDomain(yExtent(data))
      .xDomain(xExtent(data))
      .webglPlotArea(series)
      .canvasPlotArea(gridlines)
      .svgPlotArea(multi);

  function mapFinancialDataToXandY(obj) {
    return ({
      y: obj.high,
      x: obj.date
    });
  }

  function renderChart() {
      data.push(mapFinancialDataToXandY(stream.next()));
      data.shift();

      chart.yDomain(yExtent(data)).xDomain(xExtent(data));

      d3.select(chartId)
          .datum(data)
          .call(chart);

      d3.select(`${chartId} .plot-area`).call(pointer);
  }

  const pointer = fc.pointer().on('point', (event) => {
    if (event.length > 0) {
      const xVal = xScale.invert(event[0].x);
      crossHairValues = [{
        x: event[0].x,
        y: yScale(Math.sin(xVal))
      }];
    }
    renderChart();
  });

  renderChart();
  setInterval(renderChart, 50);
}