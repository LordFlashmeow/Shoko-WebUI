import React, { PropTypes } from 'react';
import cx from 'classnames';
import store from '../../core/store';
import { setAutoupdate } from '../../core/actions';

class AutoRefreshSwitch extends React.Component {
  static propTypes = {
    enabled: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let newState = !this.props.enabled;
    store.dispatch(setAutoupdate(newState));
  }

  render() {
    const {enabled} = this.props;
    return (
      <li className={cx("notification", enabled ? 'enabled' : null)}>
        <a className="dropdown-toggle" href="#" onClick={this.handleClick}>
          <i className="fa fa-check-square"/>
        </a>
      </li>
    );
  }
}

export default AutoRefreshSwitch;
