import React, { Component } from 'react'
import Spaceship from './Spaceship'

export function decorateTerm(Term) {
  return class extends Component {
    constructor (props, context) {
      super(props,context)
      
    }

    render () {
      return( 
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Spaceship display={true} onAnimationEnd={() => {return}}/>
          {React.createElement(Term, Object.assign({}, this.props, {
            onTerminal: this._onTerminal,
          }))}
      </div>
      )
    }
  }
}