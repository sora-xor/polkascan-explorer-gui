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
 * asset-detail.component.ts
 */

import { Component, OnInit } from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {Asset, AssetBalance} from "../../classes/asset.class";
import {AssetService} from "../../services/asset.service";
import {AssetBalanceService} from "../../services/asset-balance.service";
import {AppConfigService} from "../../services/app-config.service";

@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.scss']
})
export class AssetDetailComponent implements OnInit {

  public asset$: Observable<Asset>;

  private networkSubscription: Subscription;
  public networkURLPrefix: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private assetService: AssetService,
    private appConfigService: AppConfigService,
    private assetBalanceService: AssetBalanceService,
  ) { }

  ngOnInit() {
    this.networkSubscription = this.appConfigService.getCurrentNetwork().subscribe( network => {

      this.networkURLPrefix = this.appConfigService.getUrlPrefix();
      this.asset$ = this.activatedRoute.paramMap.pipe(
        switchMap((params: ParamMap) => {
          return this.assetService.get(params.get('asset_id'), { include: ['accounts'] });
        })
      );
    });
  }

  protected divider(asset) {
    return Math.pow(10, asset.attributes.precision);
  }
}
