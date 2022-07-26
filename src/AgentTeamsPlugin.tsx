import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import AgentTeamsView from './components/AgentTeamsView/AgentTeamsViewContainer';
import AgentTeamsSimpleView from './components/AgentTeamsSimpleView/AgentTeamsSimpleViewComponent';
import reducers, { namespace } from './states';
import WorkerStateHelper from './WorkerStateHelper';
import { extensionFilter, queueFilter, roleFilter, teamFilter } from './filters';
import { TeamsView, WorkersDataTable } from '@twilio/flex-ui';

const PLUGIN_NAME = 'AgentTeamsPlugin';

export default class AgentTeamsPlugin extends FlexPlugin {
  workerHelper: WorkerStateHelper;
  
  constructor() {
    super(PLUGIN_NAME);
    
    this.workerHelper = new WorkerStateHelper('');
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   * @param manager { Flex.Manager }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    this.registerReducers(manager);
    
    if (!this.showAgentViews(manager)) return;
    
    let teamsViewFilters = [
      TeamsView.activitiesFilter,
      extensionFilter,
      queueFilter,
      roleFilter,
      teamFilter
    ];
    
    flex.WorkersDataTable.defaultProps.filters = [
      ...WorkersDataTable.defaultFilters,
      {
        query: 'data.activity_name == "Break"',
        text: "Workers on break"
      }
    ];
    
    flex.ViewCollection.Content.add(
      <Flex.View name="agent-teams" key="agent-teams">
        <AgentTeamsView workerHelper={this.workerHelper} filters={teamsViewFilters} />
      </Flex.View>
    )
    
    flex.ViewCollection.Content.add(
      <Flex.View name="agent-teams-simple" key="agent-teams-simple">
        <AgentTeamsSimpleView />
      </Flex.View>
    )
    
    flex.SideNav.Content.add(
      <Flex.SideLink
      key="agent-teams"
      icon="Agents"
      iconActive="AgentsBold"
      showLabel={true}
      onClick={() => {
        flex.Actions.invokeAction("NavigateToView", {
          viewName: "agent-teams"
        })
      }}>Agent Teams</Flex.SideLink>, {sortOrder:1}
    )
    
    flex.SideNav.Content.add(
      <Flex.SideLink
      key="agent-teams-simple"
      icon="Agents"
      iconActive="AgentsBold"
      showLabel={true}
      onClick={() => {
        flex.Actions.invokeAction("NavigateToView", {
          viewName: "agent-teams-simple"
        })
      }}>Agent Teams Simple</Flex.SideLink>, {sortOrder:1}
    )
  }
  
  showAgentViews(manager: Flex.Manager) {
    const { roles } = manager.user;
    return roles.indexOf("agent") >= 0;
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  private registerReducers(manager: Flex.Manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${Flex.VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
