import React, { Component } from 'react' ;
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';



export default class TabsComponent extends Component {

  constructor(props) {
    super(props) ;
    this.state = {
      index : 0 ,
      tabsComponents : this.props.tabsComponents,
      labels : this.props.labels ,

    }
  }

  handleChange = (event,value) => {
    this.setState({index : value})
  }

  activateTabs = () => this.setState({disabled : false })

  componentWillReceiveProps = (nextProps,currentState) => {

    if (nextProps.location.search && this.state.index !== 0) {
      this.setState({index : 0 })
    }
  }

  render = () =>  {
    const renderComponent = this.props.tabsComponents[this.state.index] ;
    //const componentWithProps = React.cloneElement(renderComponent,{activateTabs : this.activateTabs}) ;

    return (
      <div className = 'tabs'>
      {

         <AppBar position="fixed">
           <Tabs value={this.state.index} onChange={this.handleChange}>
            {
              this.state.labels.map((item,i) => <Tab label = {item} key={i}/>)
            }
           </Tabs>
         </AppBar>

      }
      { renderComponent }
      </div>

    )
  }
}
