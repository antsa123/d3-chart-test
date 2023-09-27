{
  const chartId = `#${document.currentScript.getAttribute('chartId')}`;

  const stream = fc.randomFinancial().stream();
  const data = stream.take(500);

  const yExtent = fc.extentLinear().accessors([d => d.high, d => d.low]);

  const xExtent = fc.extentDate().accessors([d => d.date]);

  const gridlines = fc.annotationCanvasGridline();
  const candlestick = fc.seriesWebglCandlestick();
  const multi = fc.seriesSvgMulti().series([gridlines, candlestick]);

  const chart = fc
      .chartCartesian(d3.scaleTime(), d3.scaleLinear())
      .webglPlotArea(candlestick)
      .canvasPlotArea(gridlines)
      .svgPlotArea(multi);

  function renderChart() {
      data.push(stream.next());
      data.shift();

      chart.yDomain(yExtent(data)).xDomain(xExtent(data));

      d3.select(chartId)
          .datum(data)
          .call(chart);
  }

  renderChart();
  setInterval(renderChart, 100);
}