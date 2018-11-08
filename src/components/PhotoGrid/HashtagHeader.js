import React from "react";

class HashtagHeader extends React.Component {
  state = { randomPhoto: "" };

  componentDidMount() {
    this.setState({ randomPhoto: this.props.randomPhoto().image_url });
  }

  render() {
    return (
      <div>
        <div className="row hashtag-header">
          <div className="col-4">
            <div
              className="round-photo"
              style={{
                backgroundImage: "url('" + this.state.randomPhoto + "')"
              }}
            />
          </div>
          <div className="col-8">
            <div className="hashtag">#{this.props.hashtag}</div>
            <div className="stats">
              <div className="photos">
                <strong>{this.props.totalPhotos}</strong> photos
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

export default HashtagHeader;
