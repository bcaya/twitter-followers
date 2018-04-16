import React, { Component } from 'react';
import { Header, Image } from 'semantic-ui-react';
import axios from 'axios';
import {
  StaggeredMotion,
  spring,
  presets,
} from 'react-motion';

class Home extends Component {
  state = { x: 250, y: 300, followers: [] }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('dblclick', this.dropFollower)
    axios.get('/api/followers')
      .then( ({data}) => this.setState({ followers: data }) )
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

  render() {
    const { followers } = this.state;
    if (followers.length) {
      return (
        <StaggeredMotion
          defaultStyles={followers.map(() => ({x: 0, y: 0}))}
          styles={this.getStyles}
        >
          { avatars =>
            <div style={styles.container}>
              { avatars.map( ({x,y}, i) => {
                  let follower = followers[i];
                  if (follower) {
                    return (
                      <div 
                        key={i} 
                        style={{
                           borderRadius: '99px',
                           backgroundColor: 'white',
                           width: '150px',
                           height: '150px',
                           border: '3px solid white',
                           position: 'absolute',
                           backgroundSize: '150px',
                           backgroundImage: `url(${follower.img})`,
                           WebkitTransform: `translate3d(${x - 50}px, ${y - 50}px, 0)`,
                           transform: `translate3d(${x - 50}px, ${y - 50}px, 0)`,
                           zIndex: avatars.length - i,
                        }}
                      >
                      </div>
                    )
                  }
                })
              }
            </div>
          }
        </StaggeredMotion>
      )
    } else {
      return null
    }
  }
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