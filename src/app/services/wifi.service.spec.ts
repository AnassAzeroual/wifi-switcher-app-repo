/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WifiService } from './wifi.service';

describe('Service: Wifi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WifiService]
    });
  });

  it('should ...', inject([WifiService], (service: WifiService) => {
    expect(service).toBeTruthy();
  }));
});
