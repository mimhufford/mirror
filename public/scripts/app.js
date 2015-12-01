var Date = React.createClass({
  render: function() {
    return <div className='date'>{this.props.date}</div>;
  }
});

var Time = React.createClass({
  render: function() {
    return <div className='time'>{this.props.time}</div>;
  }
});

var Today = React.createClass({
  render : function() {
    if (this.props.weather) {
      return <div className='today'>
        <span className='temp'>{this.props.weather.temp}°</span>
        <i className={'wi ' + this.props.weather.icon}></i>
      </div>;
    } else {
      return <div></div>;
    }
  }
});

var Downloads = React.createClass({
  render : function() {
    if (this.props.downloads) {
      var desc = "download";
      desc += this.props.downloads.count == 1 ? "" : "s";
      return <div className='downloads'>
        {this.props.downloads.count} {desc} - {this.props.downloads.percent}%
      </div>;
    } else {
      return <div></div>;
    }
  }
});

var Telly = React.createClass({
  render : function() {
    if (this.props.whatsOn) {
      if (this.props.whatsOn.show) { // if it's tv
        return <div className='telly'>
          <div className='now-playing'>NOW PLAYING</div>
          <span className='title'>{this.props.whatsOn.show}</span>
          <span className='episode'> - {this.props.whatsOn.title}</span>
        </div>;
      } else { // movie
        return <div className='telly'>
          <div className='now-playing'>NOW PLAYING</div>
          <div className='title'>{this.props.whatsOn.title}</div>
        </div>;
      }
    } else {
      return <div></div>;
    }
  }
});

var News = React.createClass({
  getInitialState: function() {
    return {i: 0};
  },
  switchStory: function () {
    if (this.props.news)
      this.setState({i: (this.state.i+1) % this.props.news.length});
  },
  componentDidMount: function() {
    setInterval(this.switchStory, 5000);
  },
  render: function() {
    if (this.props.news) {
      return <div className='news'>{this.props.news[this.state.i]}</div>;
    } else {
      return <div></div>;
    }
  }
});

var App = React.createClass({
  render: function() {
    return <div id='app'>
      <div className='row'>
        <Date date={this.props.data.date} />
      </div>
      <div className='row'>
        <Time time={this.props.data.time} />
        <Today weather={this.props.data.weather} />
      </div>
      <div className='row'>
        <News news={this.props.data.news} />
      </div>
      <div className='row'>
        <Downloads downloads={this.props.data.downloads} />
      </div>
      <div className='row'>
        <Telly whatsOn={this.props.data.telly} />
      </div>
    </div>;
  }
});

var socket = io();

socket.on('data', function(data) {
  ReactDOM.render(
    <App data={data} />,
    document.getElementById('container')
  );
});

socket.on('refresh', function() {
  location.reload();
});
