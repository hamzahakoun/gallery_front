import Config from './config' ;


const sendRequest = (endpoint , data ,baseUrl = null,type = 'POST',isFile = false) => {

  let headers = {"Content-Type": "application/json"} ;
  const baseURL = !baseUrl ? Config.baseUrl : baseUrl ;
  const token = localStorage.getItem('token') ;
  if (isFile === false) {
     headers = {'Authorization' : `JWT ${token}`,"Content-Type": "application/json"} ;
     return fetch(`${baseURL}/${endpoint}`,{
       method : type ,
       body : JSON.stringify(data) ,
       headers : headers ,
     })
  } else if (isFile === true) {
    headers = {'Authorization' : `JWT ${token}`} ;
    return fetch(`${baseURL}/${endpoint}`,{
      method : type ,
      body : data,
      headers : headers ,
    })
  }


  return fetch(`${baseURL}/${endpoint}`,{
    method : type ,
    body : JSON.stringify(data) ,
    headers : headers ,
  })

}


const getRequest = (endpoint,baseUrl = null) => {

  const token = localStorage.getItem('token') ;
  const headers = {'Authorization' : `JWT ${token}`,"Content-Type": "application/json; charset=utf-8"}
  const baseURL = !baseUrl ? Config.baseUrl : baseUrl ;
  return fetch(`${baseURL}/${endpoint}`,{
    headers : headers ,
  })
}


const deleteRequest = (endpoint,baseUrl = null) => {
  const token = localStorage.getItem('token') ; 
  const headers = {'Authorization' : `JWT ${token}`,"Content-Type": "application/json; charset=utf-8"}
  const baseURL = !baseUrl ? Config.baseUrl : baseUrl ;
  return fetch(`${baseURL}/${endpoint}`,{
    method : "DELETE" ,
    headers : headers ,
  })
}


export { sendRequest, getRequest,deleteRequest } ;
