import { TestBed, inject } from '@angular/core/testing';

import { ShareSocketDataService } from './share-socket-data.service';

describe('ShareSocketDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShareSocketDataService]
    });
  });

  it('should be created', inject([ShareSocketDataService], (service: ShareSocketDataService) => {
    expect(service).toBeTruthy();
  }));
});
