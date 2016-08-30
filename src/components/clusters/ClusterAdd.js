import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {load, create} from 'redux/modules/clusters/clusters';
import {createValidator, required} from 'utils/validation';
import {Dialog} from 'components';
import {FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

@connect(state => ({
  createError: state.clustersUI.createError
}), {create, load})
@reduxForm({
  form: 'ClusterAdd',
  fields: [
    'name',
    'description',
    'assignedNodes'
  ],
  validate: createValidator({
    name: [required]
  })
})
export default class ClusterAdd extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    create: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    assignedNodes: PropTypes.array,
    orphanNodes: PropTypes.array,
    resetForm: PropTypes.func,
    submitting: PropTypes.bool,
    createError: PropTypes.string,
    valid: PropTypes.bool.isRequired,
    cluster: PropTypes.any,
    onHide: PropTypes.func.isRequired
  };

  onSubmit() {
    const { fields } = this.props;
    return this.props.create(fields.name.value);
  }

  render() {
    const { fields } = this.props;
    console.log(this.props);
    const assignedNodes = this.props.assignedNodes;
    const orphanNodes = this.props.orphanNodes;
      let options = [
          { name: 'one', label: 'one' },
          { name: 'two', label: 'two'},
          { name: 'three', label: 'three' },
          { name: 'four', label: 'four'},
          { name: 'five', label: 'five' },
          { name: 'six', label: 'six'}
      ];
    return (
      <Dialog show
              size="large"
              title={this.props.title}
              submitting={this.props.submitting}
              allowSubmit={this.props.valid}
              onReset={this.props.resetForm}
              onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}
              onHide={this.props.onHide}
      >
        <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>
          <FormGroup validationState={fields.name.error ? "error" : ""}>
            <ControlLabel>Name</ControlLabel>

            <FormControl type="text"
                         {...fields.name}
            />

            <FormControl.Feedback />

            {fields.name.error && (
              <HelpBlock>{fields.name.error}</HelpBlock>
            )}
          </FormGroup>

          <FormGroup validationState={fields.description.error ? "error" : ""}>
            <ControlLabel>Description</ControlLabel>

            <FormControl type="text"
                         {...fields.description}
            />

            <FormControl.Feedback />

            {fields.description.error && (
              <HelpBlock>{fields.description.error}</HelpBlock>
            )}
          </FormGroup>
          <FormGroup validationState={fields.assignedNodes.error ? "error" : ""}>
             <ControlLabel>Assigned Nodes</ControlLabel>
             <FormControl multiple componentClass="select">
                 <option value=""/>
                 {
                   assignedNodes.map(function (node, i) {
                         console.log(i);
                          if (typeof(node)!=='undefined'){
                         return <option key={i} value={node}>{node}</option>;
                          }
                     })
                 }
              </FormControl>
             <FormControl.Feedback />
             {fields.assignedNodes.error && (
                  <HelpBlock>{fields.assignedNodes.error}</HelpBlock>
              )}
          </FormGroup>
        </form>
      </Dialog>
    );
  }

  addCluster() {
    const {create, load, fields, resetForm} = this.props;

    return create({name: fields.name.value})
      .then(() => {
        resetForm();
        load();
        window.simpleModal.close();
      })
      .catch();
  }
}
