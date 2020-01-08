import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import { Grid } from '@material-ui/core'


const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

const styles = theme => ({

})

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      person: {
        name() {
          return 'Anonymous';
        },
        avatarUrl() {
          return avatarFallbackImage;
        },
      },
      content: '',
      newContent: '',
    };
  }

  fetchData() {
    const { userSession } = this.props
    const options = { decrypt: false }
    userSession.getFile('status.json', options)
      .then((file) => {
        var status = JSON.parse(file || '[]')
        console.log(status)
        this.setState({
          content: status
        })
      })
      .finally(() => {
        console.log("read over")
      })
  }

  saveNewStatus(contentText) {
    const { userSession } = this.props

    let content = {
      text: contentText.trim(),
      created_at: Date.now()
    }

    const options = { encrypt: false }
    userSession.putFile('content.json', JSON.stringify(content), options)
      .then(() => {
        this.setState({
          newContent: content.text
        })
      })
 }

  handleNewStatusChange(event) {
    this.setState({newContent: event.target.value})
  }

  handleNewStatusSubmit(event) {
    this.saveNewStatus(this.state.newContent)
    this.setState({
      newContent: ""
    })
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
    });
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    const { handleSignOut, userSession, classes } = this.props;
    const { person } = this.state;
    return (
      !userSession.isSignInPending() ?
        <div className="panel-welcome" id="section-2">
          <Grid container>
            <Grid item xs={6}>
              <div className="avatar-section">
                <img src={person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage} className="img-rounded avatar" id="avatar-image" alt="" />
              </div>
              <h1>Hello, <span id="heading-name">{person.name() ? person.name() : 'Nameless Person'}</span>!</h1>
              <p className="lead">
                <button
                  className="btn btn-primary btn-lg"
                  id="signout-button"
                  onClick={handleSignOut.bind(this)}
                >
                  Logout
                </button>
              </p>
            </Grid>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={12}>
                  <textarea className="input-status"
                    value={this.state.newContent}
                    onChange={e => this.handleNewStatusChange(e)}
                    placeholder="输入状态"
                  />
                </Grid>
                <Grid item xs={12}>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={e => this.handleNewStatusSubmit(e)}
                  >
                    提交
              </button>
                  <p>  Gaia content is: {this.state.content.text}</p>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div> : null
    );
  }


}
