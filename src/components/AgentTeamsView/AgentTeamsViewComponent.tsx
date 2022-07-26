import { IWorker, WorkersDataTable, Supervisor, Manager, AppState, FilterConditions, FilterDefinition, Icon } from '@twilio/flex-ui';
import { SupervisorWorkerState } from '@twilio/flex-ui/src/state/State.definition';
import React, { useEffect, useState } from 'react';
import { Worker } from "../../types/sync/LiveQuery";
import { ContainerProps } from './AgentTeamsViewContainer';
import { FilterData } from '@twilio/flex-ui/src/components/supervisor';
import WorkerStateHelper from '../../WorkerStateHelper';
import { FilterButton, FilterButtonLabel, TableHeader } from './AgentTeamsViewStyles';

interface OwnProps {
  filters: ((appState: AppState) => FilterDefinition)[];
  workerHelper: WorkerStateHelper;
}

export type Props = OwnProps & ContainerProps;

/// TODO: Bug: Filter query is stored in state, but the filters view doesn't reflect that (only the results).
/// Could remove query from state, but then view resets each time it is opened.
/// TODO: Query tr-reservations to get worker tasks. Currently hard-coded as no tasks.
/// NOTE: Interferes with AgentTeamsSimpleViewComponent. Need to reset filters when navigating between views.

const AgentTeamsViewComponent = (props: Props) => {
  const [clock, setClock] = useState(false);
  const [workers, setWorkers] = useState([] as Array<SupervisorWorkerState>);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState([] as FilterDefinition[])
  
  useEffect(() => {
    // tick every second to trigger workers update
    const interval = setInterval(() => {
      setClock(clock => !clock);
    }, 1000);
    
    // build filters array based on passed prop
    const state = Manager.getInstance().store.getState().flex;
    let builtFilters = [] as FilterDefinition[];
    props.filters.forEach(filter => {
      builtFilters.push(filter(state) as FilterDefinition);
    })
    setFilters(builtFilters);
    
    return () => {
      clearInterval(interval);
    }
  }, []);
  
  useEffect(() => {
    // build a worker state array that matches what WorkersDataTable expects
    
    let workerState: Array<SupervisorWorkerState> = [];
      
    for (var workerSid in props.workerMap) {
      let worker = stateToWorker(props.workerMap[workerSid]);
        
      workerState.push({
        worker,
        tasks: []
      });
    }
    
    setWorkers(workerState);
  }, [clock]);
  
  useEffect(() => {
    // WorkersDataTable displays workers based on this payload
    Manager.getInstance().store.dispatch({
      type: 'SUPERVISOR_UPDATE',
      payload: {
        workers,
        isLoadingWorkers: false,
        errorLoadingWorkers: 0
      }
    })
  }, [workers]);
  
  useEffect(() => {
    // Update live query based on filter query
    console.log('new query',props.teamsFilter)
    props.workerHelper.changeQuery(props.teamsFilter);
  }, [props.teamsFilter]);
  
  const stateToWorker = (workerState: Worker): IWorker => {
    let worker: IWorker = {
      sid: workerState.worker_sid,
      name: workerState.friendly_name,
      fullName: workerState.attributes?.full_name || "",
      activityName: workerState.activity_name,
      attributes: workerState.attributes || {},
      dateUpdated: new Date(workerState.date_updated),
      activityDuration: getDuration(workerState.date_activity_changed),
      source: workerState,
      isAvailable: getIsAvailable(workerState.worker_activity_sid)
    }
    
    return worker;
  }
  
  const getDuration = (updatedDateString: string | undefined): string => {
    if (!updatedDateString) return "unknown";
    
    let durStr = "";
    let seconds = Math.trunc(((new Date()).getTime() - Date.parse(updatedDateString)) / 1000);
    
    if (seconds < 60) return `${seconds}s`;
    
    if (seconds >= 3600) {
      let hours = Math.trunc(seconds / 3600);
      seconds = seconds % 3600;
      durStr = `${hours}:`;
    }
    
    let minutesStr = Math.trunc(seconds / 60).toString();
    
    if (durStr.length > 0) {
      minutesStr = minutesStr.padStart(2, '0');
    }
    
    let secondsStr = (seconds % 60).toString().padStart(2, '0');
    
    durStr = `${durStr}${minutesStr}:${secondsStr}`
    
    return durStr;
  }
  
  const getIsAvailable = (activitySid: string): boolean => {
    let isAvailable = props.activities.get(activitySid)?.available
    if (!isAvailable) isAvailable = false;
    
    return isAvailable;
  }
  
  const buildFilterQuery = (data: FilterData): string => {
    let filterQuery = '';
    let filterDefs = [];
    
    for (var attribute in data) {
      if (data[attribute].length < 1) continue;
      
      let filterDefinition = filters.find(filter => filter.id == attribute);
      
      filterDefs.push({
        name: attribute,
        condition: filterDefinition?.condition,
        values: data[attribute]
      });
      
      if (filterQuery.length > 0) {
        filterQuery += ' AND '
      }
      
      filterQuery += `${attribute} ${filterDefinition?.condition || FilterConditions.IN} ${JSON.stringify(data[attribute])}`
    }
    
    Manager.getInstance().store.dispatch({
      type: 'VIEW_UPDATE_FILTER',
      payload: {
        key: 'teams-view-filter',
        filters: filterDefs,
        legacyFilterQuery: ''
      }
    });
    
    return filterQuery;
  }
  
  const handleClose = () => {
    setShowFilters(false);
  }
  
  const handleApplyFilters = (data: FilterData, _legacyFilterQuery: string) => {
    const newQuery = buildFilterQuery(data);
    props.setTeamsFilter(newQuery);
  }
  
  const handleResetFilters = () => {
    props.setTeamsFilter('');
  }
  
  const toggleFiltersView = () => {
    setShowFilters(!showFilters);
  }
  
  return (
    <>
      <div>
        <TableHeader>
          <h1 className="Twilio">Agent Teams</h1>
          <FilterButton onClick={toggleFiltersView}>
            <FilterButtonLabel>Filter</FilterButtonLabel><Icon icon="FilterTrigger" />
          </FilterButton>
        </TableHeader>
        <WorkersDataTable
          filtersEnabled={true}
          />
      </div>
      <Supervisor.TeamFiltersPanel
        appliedLegacyFilterQuery=''
        handleCloseClick={handleClose}
        handleApplyFilters={handleApplyFilters}
        handleResetFilters={handleResetFilters}
        isHidden={!showFilters}
        filters={filters}
        isLoadingWorkers={false}
        workers={workers}
        />
    </>
  )
}

export default AgentTeamsViewComponent;