import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm, SubmissionError} from 'redux-form';
import {load, create, loadNodes} from 'redux/modules/clusters/clusters';
import {create as createNode} from 'redux/modules/nodes/nodes';
import {setUser, addUserRole, setACL, getUsers} from 'redux/modules/users/users';
import {createValidator, required, email} from 'utils/validation';
import {Dialog} from 'components';
import {FormGroup, FormControl, ControlLabel, HelpBlock, Alert, Button, ButtonGroup, Input, ButtonToolbar} from 'react-bootstrap';
import _ from 'lodash';

@connect(state => ({
  users: state.users,
  clusters: state.clusters,
  createError: state.users.setUserError
}), {create, load, createNode, loadNodes, setUser, addUserRole, setACL})
@reduxForm({
  form: 'ClusterAdd',
  fields: [
    'email',
    'username',
    'role'
  ],
  validate: createValidator({
    username: [required],
    email: [email]
  })
})
export default class UserAdd extends Component {
  static propTypes = {
    users: PropTypes.object.isRequired,
    clusters: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    resetForm: PropTypes.func,
    submitting: PropTypes.bool,
    createError: PropTypes.string,
    valid: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    okTitle: PropTypes.string,
    load: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    addUserRole: PropTypes.func.isRequired,
    setACL: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
    existingUsers: PropTypes.array,
    userName: PropTypes.string
  };
  constructor() {
    super();
    this.state = {
      firstLoad: true,
      clustersACL: {}
    };
  }
  onSubmit() {
    const {fields, setUser, setACL, onHide, existingUsers, userName} = this.props;
    const {usersList} = this.props.users;
    this.setState({
      firstLoad: false
    });
    console.log(fields);
    if (_.includes(existingUsers, fields.username.value) && this.props.okTitle === 'Create User') {
      this.refs.usernameError.textContent = 'User with name: "' + fields.username.value + '" already exists. Please use another name.';
      return false;
    }
    let clustersACL = this.state.clustersACL;
    let aclData = {};
    _.each(clustersACL, (value, key)=> {
      let id = "CLUSTER:s:" + key;
      let permission = this.state.clustersACL[key];
      let permissionVal = "";
      switch (permission) {
        case "readOnly":
          permissionVal = "R";
          break;
        case "manager":
          permissionVal = "RU";
          break;
        case "none":
          permissionVal = "";
          break;
        default:
          break;
      }
      aclData = {
        ...aclData,
        [id]: {
          "entries": [
            {
              "id": fields.username.value + ":CLUSTER:" + key,
              "sid": {
                "type": "PRINCIPAL",
                "principal": fields.username.value,
                "tenant": "root"
              },
              "granting": true,
              "permission": permissionVal
            }
          ]
        }
      };
    });
    console.log('ACLDATA', aclData);

    let roles = [
      {
        "name": fields.role.value,
        "tenant": "root"
      }
    ];
    if (userName && usersList) {
      let previousRole = _.get(usersList, userName + '.roles.0.name', '');
      if (fields.role.value === previousRole) {
        roles = [];
      } else if (previousRole && previousRole !== fields.role.value) {
        roles = [...roles, {
          "delete": true,
          "name": previousRole,
          "tenant": "root"
        }];
      }
    }

    let userData = {
      "accountNonExpired": true,
      "accountNonLocked": true,
      "credentialsNonExpired": true,
      "email": fields.email.value || '',
      "enabled": true,
      "password": "string",
      "roles": [
        {
          "name": fields.role.value || '',
          "tenant": "root"
        }
      ],
    };
    setUser(fields.username.value, userData).then(()=> {
      setACL(aclData);
    }).then(()=>onHide());
  }

  componentWillMount() {
    const {load} = this.props;
    load().then(()=> {
      const {clusters} = this.props;
      console.log(clusters);
      _.each(clusters, (value, key)=> {
        this.setState({
          clustersACL: {
            ...this.state.clustersACL,
            [key]: "none"
          }
        });
      });
    });
  }

  componentDidMount() {
    const {fields, userName} = this.props;
    const {usersList} = this.props.users;
    let defaultRole = $('#roleSelect').val();
    console.log(defaultRole);
    if (this.state.firstLoad) {
      fields.role.onChange(defaultRole);
    }
    if (userName) {
      fields.username.onChange(userName);
      let previousRole = _.get(usersList, userName + '.roles.0.name', defaultRole);
      fields.role.onChange(previousRole);
    }
  }

  render() {
    const { fields, okTitle, clusters, userName } = this.props;
    const {roles, usersList} = this.props.users;
    return (
      <Dialog show
              size="default"
              title={this.props.title}
              submitting={this.props.submitting}
              allowSubmit={this.props.valid}
              onReset={this.props.resetForm}
              onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}
              onHide={this.props.onHide}
              okTitle={okTitle || 'OK'}
      >
        {this.props.createError && (
          <Alert bsStyle="danger">
            {this.props.createError}
          </Alert>
        )}

        <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>
          <FormGroup title="required" required validationState={(fields.username.error && (!this.state.firstLoad || fields.username.touched)) ? "error" : ""}>
            <ControlLabel>Name</ControlLabel>
            <FormControl type="text"
                         {...fields.username}
                         placeholder="User Name (required)"
                         disabled = {okTitle === 'Update User'}
                         defaultValue = {userName === 'undefined' ? '' : userName}
            />
          </FormGroup>
          <div ref="usernameError" className="text-danger text-xs-center text-error field-error">
          </div>
          <FormGroup validationState={fields.email.error ? "error" : ""}>
            <ControlLabel>Email</ControlLabel>

            <FormControl type="text"
                         {...fields.email}
                         placeholder="Email"
            />

            <FormControl.Feedback />

            {fields.email.error && (
              <HelpBlock>{fields.email.error}</HelpBlock>
            )}
          </FormGroup>
          <FormGroup>
            <ControlLabel>Role</ControlLabel>
            <FormControl id="roleSelect" componentClass="select" placeholder="select" {...fields.role}>
              {
                roles.map(function listNodes(role, i) {
                  if (typeof(role) !== 'undefined' && role.name) {
                    return <option key={i} value={role.name}>{role.name}</option>;
                  }
                })
              }
            </FormControl>
          </FormGroup>
          <div className="row">
          <b className="pseudo-label">Clusters Permissions</b>
          {
            _.map(clusters, (cluster, i)=> {
              if (typeof(cluster) !== 'undefined' && cluster.name !== 'all') {
                return (
                  <div>
                  <FormGroup>
                    <div className="col-md-4 buttongroup-label"><b>{cluster.name}</b></div>
                    <div className="col-md-8">
                      <ButtonToolbar key={cluster.name} className="pseudo-radio-group pulled-right">
                        <Button bsStyle="default" onClick={this.onPermissionChange.bind(this, 'manager', cluster.name)} key={1}
                                active={this.state.clustersACL[cluster.name] === 'manager'}>Manager</Button>
                        <Button className="middleButton"
                                onClick={this.onPermissionChange.bind(this, 'readOnly', cluster.name)} key={2}
                                active={this.state.clustersACL[cluster.name] === 'readOnly'}>Read Only</Button>
                        <Button onClick={this.onPermissionChange.bind(this, 'none', cluster.name)} key={3}
                                active={this.state.clustersACL[cluster.name] === 'none'}>None</Button>
                      </ButtonToolbar>
                    </div>
                  </FormGroup>
                    </div>
                );
              }
            })
          }
        </div>
        </form>
        <div ref="error" className="text-danger text-xs-center text-error">
        </div>
      </Dialog>
    );
  }

  onPermissionChange(newI, clusterName) {
    this.setState({
      clustersACL: {
        ...this.state.clustersACL,
        [clusterName]: newI
      }
    });
  }

  // addUser() {
  //   const {create, load, fields, resetForm} = this.props;
  //
  //   return create({name: fields.name.value})
  //     .then(() => {
  //       resetForm();
  //       load();
  //       window.simpleModal.close();
  //     })
  //     .catch();
  // }
}
