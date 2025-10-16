import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('clinic/:clinicId')
  async getClinicStats(@Param('clinicId') clinicId: number) {
    return this.dashboardService.getClinicStats(clinicId);
  }

  @Get('all')
  async getAllClinicsOverview() {
    return this.dashboardService.getAllClinicsOverview();
  }
}
