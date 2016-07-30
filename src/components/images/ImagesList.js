import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {DockTable, OnOff} from '../index';
import {Label, Badge, ButtonToolbar, SplitButton, MenuItem, Panel, Button, ProgressBar, Glyphicon} from 'react-bootstrap';

export default class ImagesList extends Component {
  static propTypes = {
    data: PropTypes.array,
    loading: PropTypes.bool
  };

  COLUMNS = [
    {
      name: 'registry',
      label: 'Registry Address',
      width: '40%',
      sortable: true
    },
    {
      name: 'name',
      label: 'Name',
      width: '35%',
      sortable: true
    },
    {
      name: 'tags',
      label: 'Tags',
      width: '15%',
      render: this.tagsRender
    },
    {
      name: 'Actions',
      width: '10%',
      render: this.actionsRender
    }
  ];

  render() {
    const GROUP_BY_SELECT = ['registry', 'name'];

    const panelHeader = (
      <div className="clearfix">
        <h3>Image List</h3>
      </div>
    );

    return (
      <Panel header={panelHeader}>
        {this.props.loading && (
        <ProgressBar active now={100} />
        )}
      {(this.props.data && !this.props.loading) && (
        <DockTable columns={this.COLUMNS}
                  rows={this.props.data}
                  groupBy="registry"
                  groupBySelect={GROUP_BY_SELECT} />
      )}
      </Panel>
    );
  }

  tagsRender(image) {
    return (
      <td key="tags">
        {image.tags.map((tag) => {
          return (
            <Label bsStyle="info">{tag}</Label>
          );
        })}
      </td>
    );
  }

  actionsRender() {
    return (
      <td key="actions" className="td-actions">
      <ButtonToolbar bsStyle="default">
      <SplitButton bsStyle="info" title="Info">
      <MenuItem eventKey="1">Information</MenuItem>
      <MenuItem divider />
      <MenuItem eventKey="2">Delete</MenuItem>
      </SplitButton>
      </ButtonToolbar>
      </td>
    );
  }
}

