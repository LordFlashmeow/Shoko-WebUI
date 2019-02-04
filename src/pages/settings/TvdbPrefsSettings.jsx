// @flow
/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import SettingsPanel from '../../components/Panels/SettingsPanel';
import SettingsDropdown from '../../components/Buttons/SettingsDropdown';
import SettingsSlider from '../../components/Buttons/SettingsSlider';
import Events from '../../core/events';

import type { State } from '../../core/store';
import type { SettingsUpdateFrequencyType, SettingsTvdbPrefsType, SettingsTvdbLanguageType } from '../../core/reducers/settings/Server';

const updateFrequencyType = [
  ['1', 'Never'],
  ['2', 'Every 6 Hours'],
  ['3', 'Every 12 Hours'],
  ['4', 'Every 24 Hours'],
  ['5', 'Once a Week'],
  ['6', 'Once a Month'],
];

const tvdbLanguages = [
  ['en', 'English'],
  ['sv', 'Swedish'],
  ['no', 'Norwegian'],
  ['da', 'Danish'],
  ['fi', 'Finnish'],
  ['nl', 'Dutch'],
  ['de', 'German'],
  ['it', 'Italian'],
  ['es', 'Spanish'],
  ['fr', 'French'],
  ['pl', 'Polish'],
  ['hu', 'Hungarian'],
  ['el', 'Greek'],
  ['tr', 'Turkish'],
  ['ru', 'Russian'],
  ['he', 'Hebrew'],
  ['ja', 'Japanese'],
  ['pt', 'Portuguese'],
  ['cs', 'Czech'],
  ['sl', 'Slovenian'],
  ['hr', 'Croatian'],
  ['ko', 'Korean'],
  ['zh', 'Chinese'],
];

type Props = {
  fields: SettingsTvdbPrefsType,
  saveSettings: ({}) => void,
}

type ComponentState = {
  fields: {
    TvDB_AutoFanartAmount?: string,
    TvDB_AutoPostersAmount?: string,
    TvDB_AutoWideBannersAmount?: string,
    TvDB_Language?: SettingsTvdbLanguageType,
    TvDB_UpdateFrequency?: SettingsUpdateFrequencyType,
  }
}

class TvdbPrefsSettings extends React.PureComponent<Props, ComponentState> {
  static propTypes = {
    fields: PropTypes.shape({
      TvDB_AutoFanartAmount: PropTypes.string,
      TvDB_AutoPostersAmount: PropTypes.string,
      TvDB_AutoWideBannersAmount: PropTypes.string,
      TvDB_Language: PropTypes.string,
      TvDB_UpdateFrequency: PropTypes.string,
    }),
    saveSettings: PropTypes.func.isRequired,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      fields: {},
    };
  }

  handleChange = (field: string, value: string) => {
    const { fields } = this.state;
    this.setState({ fields: Object.assign({}, fields, { [field]: value }) });
  };

  saveSettings = () => {
    const { fields } = this.state;
    const { saveSettings } = this.props;
    saveSettings(fields);
  };

  render() {
    const { fields } = this.props;
    const { fields: stateFields } = this.state;
    const formFields = Object.assign({}, fields, stateFields);

    return (
      <SettingsPanel
        title="TvDB Preferences"
        description="TvDB preferences"
        actionName="Save"
        onAction={this.saveSettings}
        form
      >
        <SettingsSlider
          name="TvDB_AutoFanartAmount"
          label="Max Fanart"
          value={formFields.TvDB_AutoFanartAmount}
          onChange={this.handleChange}
        />
        <SettingsSlider
          name="TvDB_AutoPostersAmount"
          label="Max Posters"
          value={formFields.TvDB_AutoPostersAmount}
          onChange={this.handleChange}
        />
        <SettingsSlider
          name="TvDB_AutoWideBannersAmount"
          label="Max Wide Banners"
          value={formFields.TvDB_AutoWideBannersAmount}
          onChange={this.handleChange}
        />
        <SettingsDropdown
          name="TvDB_Language"
          label="Language"
          values={tvdbLanguages}
          value={formFields.TvDB_Language}
          onChange={this.handleChange}
        />
        <SettingsDropdown
          name="AniDB_Calendar_UpdateFrequency"
          label="Calendar"
          values={updateFrequencyType}
          value={formFields.AniDB_Calendar_UpdateFrequency}
          onChange={this.handleChange}
        />
      </SettingsPanel>
    );
  }
}

const selectComputedData = createSelector(
  state => state.settings.server,
  server => ({
    TvDB_AutoFanartAmount: server.TvDB_AutoFanartAmount,
    TvDB_AutoPostersAmount: server.TvDB_AutoPostersAmount,
    TvDB_AutoWideBannersAmount: server.TvDB_AutoWideBannersAmount,
    TvDB_Language: server.TvDB_Language,
    TvDB_UpdateFrequency: server.TvDB_UpdateFrequency,
  }),
);

function mapStateToProps(state: State): ComponentState {
  return {
    fields: selectComputedData(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveSettings: (value) => { dispatch({ type: Events.SETTINGS_SAVE_SERVER, payload: value }); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TvdbPrefsSettings);