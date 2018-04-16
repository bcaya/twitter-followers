import React, { Component } from 'react';
import { Header, Image } from 'semantic-ui-react';
import axios from 'axios';
import {
  Motion,
  StaggeredMotion,
  spring,
  presets,
} from 'react-motion';

class Home extends Component {
  state = { x: 250, y: 300, followers: [], moved: [] }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('dblclick', this.dropFollower)
    axios.get('/api/followers')
    .then( ({data}) => this.setState({ followers: data }) )
  }

  dropFollower = () => {
    let follower = this.state.followers[0];
    let followers = [
      ...this.state.followers.slice(1),
      ...this.state.followers.length
    ]
    this.setState({
      followers,
      moved: [...this.state.moved, follower]
    })
  }

  handleMouseMove = ({ pageX: x, pageY: y }) => {
    this.setState({ x, y })
  }

  getStyles = (prevStyles) => {
    const endValue = prevStyles.map((_, i) => {
      return i === 0
        ? this.state
        : {
          x: spring(prevStyles[i - 1].x, presets.gentle),
          y: spring(prevStyles[i - 1].y, presets.gentle),
        }
    })
    return endValue
  }

  movedFollowers = () => {
    const { moved } = this.state;
    const moveable = moved.filter( m => !m.transitioned )
    return moveable.map( follower => {
      return (
        <Motion
          key={follower.id}
          defaultStyle={{ x: follower.x, y: follower.y }}
        >
          { avatar => 
          <div
            style={{
              borderRadius: '99px',
              backgroundColor: 'white',
              width: '75px',
              height: '75px',
              border: '3px solid white',
              position: 'absolute',
              backgroundSize: '75px',
              backgroundImage: `url(${follower.img})`,
              transform: `translate3d(${follower.x - 100}px, ${follower.y - 100}px, 0)`,
              zIndex: 10
            }}
          >
          </div>
          }
        </Motion>
      )
    })
  }

  render() {
    return (
      <div>
        { this.movedFollowers() }
        { this.state.followers.length > 0 &&
        <StaggeredMotion
          defaultStyles={this.state.followers.map(() => ({x: 0, y: 0}))}
          styles={this.getStyles}>
          { avatars =>
          <div style={{ width: '100%', height: '100%', position: 'absolute', background: '#EEE'}}>
            { avatars.map(({x,y}, i) => {
              let follower = this.state.followers[i];
              if (follower) {
                return (
                  <div
                    key={i}
                    style={{
                      borderRadius: '99px',
                      backgroundColor: 'white',
                      width: '50px',
                      height: '50px',
                      border: '3px solid white',
                      position: 'absolute',
                      backgroundSize: '50px',
                      backgroundImage: `url(${this.state.followers[i].img})`,
                      WebkitTransform: `translate3d(${x - 50}px, ${y - 50}px, 0)`,
                      transform: `translate3d(${x - 50}px, ${y - 50}px, 0)`,
                      zIndex: avatars.length - i,
                    }}
                  />
                )
              } else {
                return null
              }
              }
              )}
            </div>
          }
        </StaggeredMotion>
        }
      </div>
    );
  };

}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    background: '#EEE',
  },
  person: {
    borderRadius: '99px',
    backgroundColor: 'white',
    width: '50px',
    height: '50px',
    border: '3px solid white',
    position: 'absolute',
    backgroundSize: '50px',
  }

}

export default Home;