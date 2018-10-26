import React from 'react' ;
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import '../styles/tags-list.css' ;


const setSpan = (length) => length + 1 ;


const TagsList = ({data,handleToggle,checked}) => {

  return (
      <div className = 'grid'>
        {
          Object.keys(data).map(k => {
            const span = setSpan(data[k].length) ;
            const styl = {'gridRowEnd' : `span ${span}`}

            return (
              <Card style = {styl} key = {k}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom style = {{backgroundColor : '#3f51b5',color : '#ffffff',padding : '10px'}}>
                    {k.toUpperCase()}
                  </Typography>
                  <List>
                    {
                      data[k].map(item => {

                        return (
                        <ListItem
                            key={item.id}
                            role={undefined}
                            dense
                            button
                            onClick={() => handleToggle(item)}
                          >

                          <Checkbox
                            checked={checked.indexOf(item.content) !== -1}
                            tabIndex={-1}
                            disableRipple
                          />
                          <ListItemText primary={`${item.content}`} />
                          <ListItemSecondaryAction>{item.img_num}</ListItemSecondaryAction>
                        </ListItem>
                        )
                      })
                    }
                  </List>

                </CardContent>
              </Card>
            )
          })
        }
      </div>

  )
}



export default TagsList ;
