import * as Flex from '@twilio/flex-ui';
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux';
import { AppState, namespace } from "../../states";
import { Actions as TeamsFilterActions } from '../../states/TeamsFilterState'
import AgentTeamsViewComponent from "./AgentTeamsViewComponent";

const mapStateToProps = (state: AppState) => ({
  workerMap: state[namespace].workerMap,
  teamsFilter: state[namespace].teamsFilter,
  activities: state.flex.worker.activities
});

const mapDispatchToProps = (dispatch: Dispatch<Flex.ITask>) => ({
  setTeamsFilter: bindActionCreators(TeamsFilterActions.setFilter, dispatch),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type ContainerProps = ConnectedProps<typeof connector>;

export default connector(AgentTeamsViewComponent);