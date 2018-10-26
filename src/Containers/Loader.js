import React , { Component } from 'react' ;
import { getRequest } from '../utils' ;
import { Redirect } from 'react-router-dom' ;

export default class Loader extends Component {

  constructor(props) {

    super(props) ;
    this.state = {
      data : null,
      loading : this.props.loading ,
      endpoint : this.props.endpoint ,
    }

  }

  componentDidMount = () => {
      const endpoint = this.props.endpoint ;
      this.getData(endpoint) ;
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.endpoint !== this.state.endpoint) {
      this.setState({data : null,endpoint : newProps.endpoint})
      const endpoint = newProps.endpoint ;
      this.getData(endpoint) ;
    } else {
      this.setState({endpoint : newProps.endpoint}) ;
    }

  }

  getData = (endpoint) => {

    getRequest(endpoint)
    .then(resp => {
      if (resp.status === 404) {
        this.setState({data : false})
      } else {
        resp.json().then(data => this.setState({data : data}))
      }
    })
  }


  render = () => {
    const loading = this.state.loading !== null ? this.state.loading : <h3 className = 'loading'>Loading ...</h3> ;
    let childrenWithProps = null ;
    if (this.state.data) {
      const children = this.props.children ;
      childrenWithProps = React.Children.map(children, child =>
      // i unpacked the props in the clone cuz i need the endpoint props in grid container
      // so i can decide whether to append the new created item (after uploade)
      /// or not
      React.cloneElement(child, { data: this.state.data,...this.props }));
    }

    return this.state.data === false ? <Redirect to = '/' /> :
    <div className = 'loader'>
      { !this.state.data && loading }
      { this.state.data && childrenWithProps }

    </div>


  }
}
