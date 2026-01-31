import { Component, ViewChild, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { TreeChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import { skillNodes, SkillNode, skillTree } from '../shared/skill-set';

echarts.use([TreeChart, GridComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-skills',
  imports: [
    NgxEchartsDirective,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
  providers: [provideEchartsCore({ echarts })],
})
export class Skills implements OnInit {
  public filter = signal('');
  public displayedColumns: string[] = ['star', 'name', 'experience'];

  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  public dataSource = new MatTableDataSource<SkillNode>(
    skillNodes.sort((a, b) => {
      if (a.weight === b.weight) {
        return a.name.localeCompare(b.name);
      } else {
        return a.weight - b.weight;
      }
    }),
  );

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.dataSource.filterPredicate = (data: any, filter: any) => {
      return (
        data.name.toLowerCase().indexOf(filter) !== -1 ||
        (data.tags && data.tags.indexOf(filter) !== -1)
      );
    };
  }

  public setFilter(filter: string): void {
    this.filter.set(filter);
    this.dataSource.filter = filter.toLowerCase();
  }

  public options = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
    },
    series: [
      {
        type: 'tree',
        data: skillTree,
        top: '1%',
        left: '7%',
        bottom: '1%',
        right: '20%',
        symbolSize: 7,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 9,
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
          },
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
        initialTreeDepth: 3,
      },
    ],
  };
}
