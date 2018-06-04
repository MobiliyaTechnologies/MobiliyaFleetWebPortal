import { TestBed, inject } from '@angular/core/testing';

import { RestService } from './rest-service.service';

describe('RestServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestService]
    });
  });

  it('should be created', inject([RestService], (service: RestService) => {
    expect(service).toBeTruthy();
  }));
});
