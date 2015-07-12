"use strict";

var GraphKey = React.createClass({
  displayName: "GraphKey",

  getInitialState: function getInitialState() {
    return {};
  },

  handleChange: function handleChange(arg) {
    MeasurementActions.selectAxis(this.props.keyId, this.props.optionId, arg.target.value);
  },

  render: function render() {
    var keys = [];
    if (this.props.measurement) {
      var index = 0;
      keys = Object.keys(this.props.measurement).map(function (key) {
        return React.createElement(
          "option",
          { value: key, key: index++ },
          key
        );
      });
    }

    return React.createElement(
      "div",
      { className: "field" },
      React.createElement(
        "label",
        null,
        this.props.label
      ),
      React.createElement(
        "select",
        { onChange: this.handleChange, className: "ui select dropdown" },
        React.createElement("option", null),
        keys
      )
    );
  }
});

var GraphType = React.createClass({
  displayName: "GraphType",

  render: function render() {
    return React.createElement(
      "div",
      { className: "field two wide" },
      React.createElement(
        "label",
        null,
        this.props.label
      ),
      this.props.arg.type.toUpperCase()
    );
  }
});

var GraphConfiguration = React.createClass({
  displayName: "GraphConfiguration",

  mixins: [Reflux.connect(measurementStore, "options")],

  willBuildGraph: function willBuildGraph() {
    // add class to set element height needed by echarts
    $("#chart").addClass("graph-content");
  },

  buildGraph: function buildGraph(argument) {
    this.willBuildGraph();
    pgUtils.buildGraphFromSingle(this.props.data, this.state.options);
  },

  addElement: function addElement(argument) {
    this.setState({ graphElements: this.state.graphElements.concat(argument) });
    MeasurementActions.selectChart(this.state.graphElements.length - 1, argument.type);
  },

  getInitialState: function getInitialState() {
    return { graphElements: [] };
  },

  componentDidMount: function componentDidMount(argument) {
    var self = this;
    setTimeout(function () {
      self.init();
    }, 500);
  },

  init: function init(argument) {
    var self = this;
    $(".ui.dropdown.adder").dropdown({
      action: function action(text, value) {
        self.addElement({ type: value });
      }
    });
  },

  getGraphElement: function getGraphElement(measurement, argument, idx) {
    switch (argument.type) {
      case "bar":
      case "line":
        {
          return React.createElement(
            "div",
            { className: "three fields", key: idx },
            React.createElement(GraphType, { keyId: idx, arg: argument, label: "Presentation" }),
            React.createElement(GraphKey, { measurement: measurement, keyId: idx, optionId: "xAxis", label: "X Axis" }),
            React.createElement(GraphKey, { measurement: measurement, keyId: idx, optionId: "yAxis", label: "Y Axis" })
          );
        }
      default:
        console.error("No graph type!");
        return React.createElement(
          "div",
          null,
          "Error"
        );
    }
  },

  render: function render() {
    var self = this;
    var measurement = this.props.data;
    var elements = this.state.graphElements.map(function (element, idx) {
      return self.getGraphElement(measurement, element, idx);
    });

    return React.createElement(
      "div",
      { className: "graphConfiguration" },
      React.createElement(
        "div",
        { className: "ui form" },
        elements,
        React.createElement(
          "div",
          { className: "field" },
          React.createElement(
            "div",
            { className: "ui left pointing dropdown icon button adder" },
            React.createElement("i", { className: "icon plus" }),
            React.createElement(
              "div",
              { className: "menu" },
              React.createElement(
                "div",
                { className: "item", "data-value": "bar" },
                "Bar"
              ),
              React.createElement(
                "div",
                { className: "item", "data-value": "line" },
                "Line"
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "field" },
          React.createElement(
            "button",
            { className: "ui primary button centered", onClick: this.buildGraph },
            "Build Graph"
          )
        )
      )
    );
  }
});