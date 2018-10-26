import React from 'react' ;
import '../styles/grid.css' ;
import { Link } from 'react-router-dom' ;
import Grid from '@material-ui/core/Grid';
import '../styles/grid.css' ;


const Grd = (props) => {
  const { data } = props  ;

  return(
    <Grid className = 'imgs-grid' container spacing = {8}>
      {
        data.map(item => {
          return (

              <Grid  item sm = {3} xs = {6} className = 'grid-item' key = {item.id}>
                <Link to = {{pathname : item.id  }}>
                    <img alt = {item.id} className = 'grid-img' src = {item.thumbnail} />
                </Link>
              </Grid>
          )
        })
      }
    </Grid>
  )

}

export default Grd ;
