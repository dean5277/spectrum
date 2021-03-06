// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';
import {
  SlackChannelRow,
  ChannelName,
  StyledSelect,
  Select,
  SendsTo,
} from './style';
import { addToastWithTimeout } from 'src/actions/toasts';
import updateChannelSlackBotLinksMutation from 'shared/graphql/mutations/channel/updateChannelSlackBotLinks';

type SlackChannel = {
  id: string,
  name: string,
};

type ChannelWithSlackSettings = {
  ...$Exact<ChannelInfoType>,
  slackSettings: {
    botLinks: {
      threadCreated: ?string,
    },
  },
};

type Props = {
  slackChannels: Array<SlackChannel>,
  channel: ChannelWithSlackSettings,
  updateChannelSlackBotLinks: Function,
  dispatch: Function,
};

class ChannelSlackManager extends React.Component<Props> {
  handleSlackChannelChange = e => {
    const { value } = e.target;
    const { channel, dispatch, updateChannelSlackBotLinks } = this.props;
    const type = 'threadCreated';
    const input = {
      slackChannelId: value,
      channelId: channel.id,
      eventType: type,
    };

    return updateChannelSlackBotLinks(input)
      .then(() => dispatch(addToastWithTimeout('success', 'Settings saved')))
      .catch(err => dispatch(addToastWithTimeout('error', err.message)));
  };

  render() {
    const { slackChannels, channel } = this.props;
    const selectedSlackChannelId =
      channel.slackSettings &&
      channel.slackSettings.botLinks &&
      channel.slackSettings.botLinks.threadCreated;

    return (
      <SlackChannelRow>
        <ChannelName>{channel.name}</ChannelName>

        <SendsTo>send notifications to &rarr;</SendsTo>
        <StyledSelect>
          <Select
            onChange={this.handleSlackChannelChange}
            defaultValue={selectedSlackChannelId}
          >
            <option value={''}>{'# '}</option>
            {slackChannels.map(channel => (
              <option key={channel.id} value={channel.id}>
                # {channel.name}
              </option>
            ))}
          </Select>
        </StyledSelect>
      </SlackChannelRow>
    );
  }
}

export default compose(connect(), updateChannelSlackBotLinksMutation)(
  ChannelSlackManager
);
