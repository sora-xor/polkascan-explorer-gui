/*
 * Polkascan Explorer GUI
 *
 * Copyright 2018-2020 openAware BV (NL).
 * This file is part of Polkascan.
 *
 * Polkascan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Polkascan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Polkascan. If not, see <http://www.gnu.org/licenses/>.
 *
 * balances-transfer-detail.component.ts
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {BalanceTransfer} from '../../classes/balancetransfer.class';
import {BalanceTransferService} from '../../services/balance-transfer.service';
import {AppConfigService} from '../../services/app-config.service';

@Component({
  selector: 'app-balances-transfer-detail',
  templateUrl: './balances-transfer-detail.component.html',
  styleUrls: ['./balances-transfer-detail.component.scss']
})
export class BalancesTransferDetailComponent implements OnInit, OnDestroy {

  public balanceTransfer$: Observable<BalanceTransfer>;

  private networkSubscription: Subscription;
  public networkURLPrefix: string;

  public networkTokenDecimals: number;
  public networkTokenSymbol: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private balanceTransferService: BalanceTransferService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit() {

    this.networkSubscription = this.appConfigService.getCurrentNetwork().subscribe( network => {
      this.networkURLPrefix = this.appConfigService.getUrlPrefix();

      this.networkTokenDecimals = +network.attributes.token_decimals;
      this.networkTokenSymbol = network.attributes.token_symbol;


      this.balanceTransfer$ = this.activatedRoute.paramMap.pipe(
        switchMap((params: ParamMap) => {
          return this.balanceTransferService.get(params.get('id'));
        })
      );
    });
  }

  public formatBalance(balance: number, precision: number) {
    return balance / Math.pow(10, precision);
  }

  ngOnDestroy() {
    // Will clear when component is destroyed e.g. route is navigated away from.
    this.networkSubscription.unsubscribe();
  }
}
