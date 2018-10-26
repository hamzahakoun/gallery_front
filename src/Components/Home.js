import React, { Component } from 'react' ;
import { Loader, GridContainer,TagsListContainer } from '../Containers' ;
import TabsComponent from './Tabs' ;
import CircularProgress from '@material-ui/core/CircularProgress';


const Home = (props) => {

  let endpoint = 'images' ;
  if (props.location.search.length > 6) {
    endpoint = `images${props.location.search}` ;
  }

  return (
    <div className = 'home' style = {{backgroundColor : '#f4efef'}}>
          <TabsComponent {...props}
            tabsComponents = {[
              <Loader endpoint = {endpoint}  loading = {<CircularProgress className = {'loading'}/>}><GridContainer/></Loader>,
              <Loader endpoint = {'images?liked=1'} loading = {<CircularProgress className = {'loading'}/>}><GridContainer  /></Loader>,
              <Loader endpoint = {'images/tags?exists=1'} loading = {<CircularProgress className = {'loading'}/>}><TagsListContainer {...props} /></Loader>,

            ]}
            labels = {['Home','Liked','Tags']}
          />
      </div>
  )
}


export default Home ;
