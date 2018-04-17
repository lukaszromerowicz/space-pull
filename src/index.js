import React, { Component } from 'react'
import { SpaceshipLand, SpaceshipTakeoff } from './Spaceship'

const detectGitPull = (data) => {
  const patterns = 
  ['^Updating {0,}([a-z0-9A-Z]+\.{2,3}[a-z0-9A-Z]+)|(\[[a-z0-9A-Z]+\.{2,3}[a-z0-9A-Z]+\])$', '^Unpacking objects', 'Already up-to-date.']
  const antiPattern = /CONFLICT/
  
  return new RegExp(`(${patterns.join(')|(')})`).test(data) && !antiPattern.test(data)
}

const detectGitPush = (data) => {
  const patterns = 
  ['To .+.git', 'Everything up-to-date.']
  const antiPattern = /CONFLICT/
  
  return new RegExp(`(${patterns.join(')|(')})`).test(data) && !antiPattern.test(data)
}

export const middleware = (store) => (next) => (action) => {
  if ('SESSION_ADD_DATA' === action.type) {
    const { data } = action;

    if (detectGitPull(data)) {
      store.dispatch({
        type: 'TOGGLE_PULL_ROCKET'
      })
    }

    if (detectGitPush(data)) {
      store.dispatch({
        type: 'TOGGLE_PUSH_ROCKET'
      })
    }

    next(action)
  } else {
    next(action)
  }
}

export function reduceUI(state, action) {
  switch (action.type) {
    case 'TOGGLE_PULL_ROCKET': {
      if (state.pullRocket === undefined ) {
        return state.set('pullRocket', 1)
      } else {
        return state.set('pullRocket', state.pullRocket + 1)
      }
    }
    case 'TOGGLE_PUSH_ROCKET': {
      if (state.pushRocket === undefined ) {
        return state.set('pushRocket', 1)
      } else {
        return state.set('pushRocket', state.pushRocket + 1)
      }
    }
      
  }
  return state
}

export function mapTermsState(state, map) {
  return Object.assign(map, {
    pullRocket: state.ui.pullRocket,
    pushRocket: state.ui.pushRocket
  })
}


const passProps = (uid, parentProps, props) => {
  return Object.assign(props, {
    pullRocket: parentProps.pullRocket,
    pushRocket: parentProps.pushRocket
  })
}

export { passProps as getTermGroupProps }
export { passProps as getTermProps }

export function decorateTerm(Term) {
  return class extends Component {
    constructor (props, context) {
      super(props,context)
      this.state = {
        displayPullRocket: false,
        displayPushRocket: false
      }
    }

    onTerminal(term) {
      if (this.props.onTerminal) this.props.onTerminal(term);
      this._div = term.div_;
      this._window = term.document_.defaultView;
    }

    componentWillReceiveProps(nextProps) {
      if((nextProps.pullRocket > this.props.pullRocket) || (nextProps.pullRocket === 1 && this.props.pullRocket === undefined)) {
        this.setState({displayPullRocket: true})
      }
      if((nextProps.pushRocket > this.props.pushRocket) || (nextProps.pushRocket === 1 && this.props.pushRocket === undefined)) {
        this.setState({displayPushRocket: true})
      }
    }

    onAnimationEnd(event) {
      setTimeout(() => {
        this.setState({
          displayPullRocket: false
        })
      }, 1500);
    }

    onTakeoffAnimationEnd(event) {
      setTimeout(() => {
        this.setState({
          displayPushRocket: false
        })
      }, 1500)
    }

    render () {
      return( 
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {React.createElement(Term, Object.assign({}, this.props, {
            onTerminal: this._onTerminal,
          }))}
          <SpaceshipLand display={this.state.displayPullRocket} onAnimationEnd={this.onAnimationEnd.bind(this)}/>
          <SpaceshipTakeoff display={this.state.displayPushRocket} onAnimationEnd={this.onTakeoffAnimationEnd.bind(this)}/>
      </div>
      )
    }
  }
}
