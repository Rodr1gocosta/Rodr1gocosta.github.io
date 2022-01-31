import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { OS } from 'src/app/models/OS';
import { ClienteService } from 'src/app/services/cliente.service';
import { OsService } from 'src/app/services/os.service';
import { TecnicoService } from 'src/app/services/tecnico.service';
import { OsViewsComponent } from '../os-views/os-views.component';

@Component({
  selector: 'app-os-read',
  templateUrl: './os-read.component.html',
  styleUrls: ['./os-read.component.css']
})
export class OsReadComponent implements AfterViewInit {

  lista: OS [] = [];

  displayedColumns: string[] = ['tecnico', 'cliente', 'endereco', 'abertura', 'fechamento', 'prioridade', 'status', 'acao'];
  dataSource = new MatTableDataSource<OS>(this.lista);
  clickedRows = new Set<OS>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: OsService,
              private route: Router,
              private tecnicoService: TecnicoService,
              private clienteService: ClienteService,) {}

  ngAfterViewInit() { 
    this.findAll();
  }

  findAll():void {
    this.service.findAll().subscribe((resposta) => {
      resposta.forEach(x => {
        if(x.status != "ENCERRADO") {
          this.lista.push(x)
        }
      })
      this.listarTecnico();
      this.listarCliente();
      this.dataSource = new MatTableDataSource<OS>(this.lista);
      this.dataSource.paginator = this.paginator;
    })
  }

  navigateToCreate():void {
    this.route.navigate(['os/create'])
  }

  listarTecnico(): void {
    this.lista.forEach(x => {
      this.tecnicoService.findById(x.tecnico).subscribe(resposta => {
        x.tecnico = resposta.nome;
      })
    })
  }

  listarCliente(): void {
    this.lista.forEach(x => {
      this.clienteService.findById(x.cliente).subscribe(resposta => {
        x.cliente = resposta;
      })
    })
  }

  prioridade(x: any) {
    if(x == 'BAIXA') {
      return 'baixa'
    }else if(x == 'MEDIA') {
      return 'media'
    }else {
      return 'alta'
    }
  }
}
