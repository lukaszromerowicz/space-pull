import React, { Component } from 'react'

export function decorateTerm(Term) {
  return class extends Component {
    constructor (props, context) {
      super(props,context)
      
    }

    render () {
      return( 
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {React.createElement(Term, Object.assign({}, this.props, {
            onTerminal: this._onTerminal,
          }))}
      </div>
      )
    }
  }
}