import LiveQueryHelper, { LiveQueryAddedEvent, LiveQueryRemovedEvent, LiveQueryUpdatedEvent } from "./LiveQueryHelper";
import { Worker } from "./types/sync/LiveQuery";
import { Actions, WorkerMapState } from "./states/WorkerMapState";

export default class WorkerStateHelper extends LiveQueryHelper<Worker> {
  constructor(query: string) {
    super('tr-worker', query);
    this.initQuery();
  }
  
  private initQuery() {
    this.startLiveQuery().then((items) => {
      console.log('Initial worker state', items)
      this.manager.store.dispatch(
        Actions.initWorkers(items)
      );
    });
  }
  
  changeQuery(query: string) {
    if (query == this.queryExpression) return;
    
    this.closeLiveQuery();
    this.queryExpression = query;
    this.initQuery();
  }
  
  protected onItemAdded?(event: LiveQueryAddedEvent<Worker>): void {
    console.log('Worker added',event);
    this.manager.store.dispatch(
      Actions.updateWorker(event as unknown as WorkerMapState)
    )
  }
  
  protected onItemUpdated?(event: LiveQueryUpdatedEvent<Worker>): void {
    console.log('Worker updated',event);
    this.manager.store.dispatch(
      Actions.updateWorker(event as unknown as WorkerMapState)
    )
  }
  
  protected onItemRemoved?(event: LiveQueryRemovedEvent): void {
    console.log('Worker removed',event);
    this.manager.store.dispatch(
      Actions.removeWorker(event.key)
    )
  }
}