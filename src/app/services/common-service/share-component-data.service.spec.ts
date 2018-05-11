import { TestBed, inject } from '@angular/core/testing';

import { ShareComponentDataService } from './share-component-data.service';

describe('ShareComponentDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShareComponentDataService]
    });
  });

  it('should be created', inject([ShareComponentDataService], (service: ShareComponentDataService) => {
    expect(service).toBeTruthy();
  }));
});
