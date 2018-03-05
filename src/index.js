import React, { Component } from 'react'
import Spaceship from './Spaceship'


const detectGitPull = (data) => {
  const patterns = 
  ['^Updating {0,}([a-z0-9A-Z]+\.{2,3}[a-z0-9A-Z]+)|(\[[a-z0-9A-Z]+\.{2,3}[a-z0-9A-Z]+\])$', '^Unpacking objects']
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
  }
  return state
}

export function mapTermsState(state, map) {
  return Object.assign(map, {
    pullRocket: state.ui.pullRocket
  })
}


const passProps = (uid, parentProps, props) => {
  return Object.assign(props, {
    pullRocket: parentProps.pullRocket
  })
}

export { passProps as getTermGroupProps }
export { passProps as getTermProps }

export function decorateTerm(Term) {
  return class extends Component {
    constructor (props, context) {
      super(props,context)
      this.state = {
        displayPullRocket: false
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
    }

    onAnimationEnd(event) {
      setTimeout(() => {
          this.setState({
          displayPullRocket: false
        })
      }, 1500)
    }

    render () {
      return( 
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {React.createElement(Term, Object.assign({}, this.props, {
            onTerminal: this._onTerminal,
          }))}
          <Spaceship display={this.state.displayPullRocket} onAnimationEnd={this.onAnimationEnd.bind(this)}/>
      </div>
      )
    }
  }
}