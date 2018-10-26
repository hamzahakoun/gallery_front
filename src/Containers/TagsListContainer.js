import React, { Component } from 'react' ;
import { TagsList } from '../Components' ;
import Button from '@material-ui/core/Button';
import  { Search,DeleteForever,ViewComfy } from '@material-ui/icons';



const styles = {
  container : {
    padding : '60px 10px' ,
    backgroundColor : '#f4efef',
    minHeight : '100vh',

  }
}

export default class TagsListContainer extends Component {

  constructor(props) {
    super(props) ;
    this.state = {
      data : props.data ,
      readyData : null,
      cleard : false ,
      checked  : this.props.location.search !== '' && this.props.location.search.length > 6 ? this.props.location.search.slice(6).split(',') : [] ,
    }
  
  }


  handleToggle = (item) => {
     const { checked } = this.state;
     const currentIndex = checked.indexOf(item.content);
     const newChecked = [...checked];

     if (currentIndex === -1) {
       newChecked.push(item.content);
     } else {
       newChecked.splice(currentIndex, 1);
     }

     this.setState({
       checked: newChecked,
     });
  }


  clearAllTags = () => {
    if (this.props.location.search.length > 6) {
        this.setState({checked : [],cleard : true})
    }else {
      this.setState({checked : []})
    }

  }

  checkAllTags = () => {
    let checked = [] ;
    Object.keys(this.state.readyData).map(k => {
      this.state.readyData[k].map(item => checked.push(item.content)) ;
    })

    this.setState({checked})
  }

  search = (tags) => {
    let tagString = tags.join(',') ;
    this.props.history.push(`/?tags=${tagString}`) ;
  }

  componentDidMount = () => {
    const readyData = this.prepareData(this.state.data) ;
    this.setState({ readyData }) ;
  }

  componentWillReceiveProps = (newProps,currentState) => {
    const rowData = newProps.data ;
    const readyData = this.prepareData(rowData) ;
    this.setState({ readyData }) ;
  }

  prepareData = (rowData) => {
    const result = {} ;
    rowData.map(item => {
      const firstLetter = item.content.slice(0,1) ;
      if (result[firstLetter.toLowerCase()]) {
        result[firstLetter.toLowerCase()].push(item) ;
      } else {
        result[firstLetter.toLowerCase()] = [item] ;
      }
    })
    return result ;
  }

  render = () => {

    return(
      <div style = {styles.container}>
        {this.state.readyData &&   <TagsList  data = {this.state.readyData} handleToggle = {this.handleToggle} checked = {this.state.checked} />}
        {!this.state.readyData && <h3 className = {'loading'}>Loading ...</h3>}
        <Button  disabled = {this.state.checked.length === this.state.data.length } onClick = { this.checkAllTags }  variant="fab" color="secondary" aria-label="Search" style = {{position : 'fixed',right : '5%',bottom : '26%'}}>
          <ViewComfy />
        </Button>
        <Button disabled = {this.state.checked.length === 0 && !this.state.cleard} onClick = { () => this.search(this.state.checked) }  variant="fab" color="secondary" aria-label="Search" style = {{position : 'fixed',right : '5%',bottom : '6%'}}>
          <Search />
        </Button>
        <Button  onClick = {this.clearAllTags} disabled = { this.state.checked.length === 0 } variant="fab" color="secondary" aria-label="Search" style = {{position : 'fixed',right : '5%',bottom : '16%'}}>
          <DeleteForever />
        </Button>
      </div>
    )
  }

}
