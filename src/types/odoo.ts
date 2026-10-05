export type DomainId = 
  | 'orders' 
  | 'workshop' 
  | 'inventory' 
  | 'purchasing' 
  | 'finance' 
  | 'franchise' 
  | 'garage' 
  | 'bi';

export interface ModuleSpec {
  id: string;
  code: string;
  nameFa: string;
  nameEn: string;
  domainId: DomainId;
  odooModel: string;
  description: string;
  masterData: string[];
  transactions: string[];
  workflow: string[];
  businessRules: string[];
  roles: string[];
  uiViews: ('tree' | 'form' | 'kanban' | 'pivot' | 'graph' | 'calendar' | 'activity')[];
  integrations: string[];
  slaNotifications: string[];
  kpis: string[];
  securityRules: string;
}

export interface DomainInfo {
  id: DomainId;
  number: number;
  nameFa: string;
  nameEn: string;
  icon: string;
  color: string;
  description: string;
  moduleCount: number;
}

// 1. Order & Service Models
export type OrderState = 
  | 'draft' 
  | 'appointment' 
  | 'accepted' 
  | 'assigned' 
  | 'checked_in' 
  | 'inspecting' 
  | 'in_progress' 
  | 'change_order_pending' 
  | 'qc_pending' 
  | 'done' 
  | 'delivered' 
  | 'cancelled';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'labor' | 'part' | 'addon';
  price: number;
  qty: number;
  estimatedMinutes: number;
  partSku?: string;
}

export interface InspectionData {
  odometer: number;
  fuelLevel: number;
  obdCodes: string[];
  scratches: { area: string; severity: 'minor' | 'medium' | 'major' }[];
  tirePressurePsi: number;
  batteryHealthPercent: number;
  brakePadWearPercent: number;
  inspectorNotes: string;
  hasPhotos: boolean;
}

export interface ChangeOrder {
  id: string;
  title: string;
  reason: string;
  additionalItems: ServiceItem[];
  totalAdditionalAmount: number;
  customerApproved: boolean;
  approvalTimestamp?: string;
  evidenceNotes: string;
}

export interface ServiceOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  branchId: string;
  branchName: string;
  serviceType: 'regular_service' | 'brake_suspension' | 'engine_tuning' | 'electrical_diag' | 'full_checkup' | 'mobile_rescue';
  channel: 'online_app' | 'call_center' | 'walk_in' | 'fleet_contract';
  priority: 'normal' | 'high' | 'urgent';
  state: OrderState;
  bayId?: string;
  bayName?: string;
  technicianId?: string;
  technicianName?: string;
  appointmentTime: string;
  checkInTime?: string;
  startTime?: string;
  endTime?: string;
  slaLimitMinutes: number;
  elapsedMinutes: number;
  slaBreached: boolean;
  services: ServiceItem[];
  inspection?: InspectionData;
  changeOrders: ChangeOrder[];
  qcPassed?: boolean;
  qcNotes?: string;
  totalLaborAmount: number;
  totalPartsAmount: number;
  totalAmount: number;
  isPaid: boolean;
  createdAt: string;
}

// 2. Workshop & Bay Models
export interface Bay {
  id: string;
  name: string;
  code: string;
  type: 'two_post_lift' | 'four_post_alignment' | 'diagnostic_electric' | 'quick_service' | 'mobile_van';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  currentOrderId?: string;
  currentOrderNumber?: string;
  currentTechnician?: string;
  branchId: string;
}

export interface Technician {
  id: string;
  nameFa: string;
  code: string;
  skills: string[];
  certifications: string[];
  status: 'active' | 'busy' | 'on_leave' | 'break';
  branchId: string;
  activeOrderId?: string;
  efficiencyScore: number;
  ftfrScore: number; // First Time Fix Rate
  completedOrdersCount: number;
}

// 3. Inventory & Parts Models
export interface SparePart {
  id: string;
  sku: string;
  nameFa: string;
  nameEn: string;
  category: 'oil_fluid' | 'filter' | 'brake_chassis' | 'battery' | 'tire' | 'electrical' | 'engine_part';
  brand: string;
  oemCode: string;
  compatibleModels: string[];
  unit: string;
  costPrice: number;
  salePrice: number;
  qtyOnHand: number;
  qtyReserved: number;
  qtyAvailable: number;
  minSafetyStock: number;
  reorderPoint: number;
  batchNumber: string;
  expiryDate?: string;
  authenticityCode: string;
  isAuthenticVerified: boolean;
}

// 4. Purchasing & Supplier
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  category: string;
  rating: number; // 1-5
  creditTermDays: number;
  creditLimit: number;
  currentBalance: number;
  deliveryOnTimeRate: number; // percentage
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: { partId: string; partName: string; sku: string; qty: number; unitPrice: number; subtotal: number }[];
  totalAmount: number;
  status: 'draft' | 'approved' | 'sent' | 'partial_received' | 'received' | 'invoiced' | 'cancelled';
  expectedDate: string;
  receivedDate?: string;
  createdAt: string;
}

// 5. Finance Models
export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  laborTotal: number;
  partsTotal: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'pos_terminal' | 'online_gateway' | 'bnpl_snapp' | 'corporate_credit';
  status: 'draft' | 'posted' | 'paid' | 'cancelled';
  partnerShareAmount: number;
  platformCommissionAmount: number;
  warrantyReserveAmount: number;
  issuedAt: string;
}

// 6. Partner & Franchise
export interface PartnerBranch {
  id: string;
  name: string;
  type: 'central' | 'franchise' | 'authorized_workshop' | 'mobile_rescue_unit';
  ownerName: string;
  phone: string;
  city: string;
  address: string;
  baysCount: number;
  activeTechniciansCount: number;
  contractStatus: 'active' | 'probation' | 'suspended' | 'pending_renewal';
  commissionRatePercent: number;
  monthlyRevenue: number;
  ftfrRate: number;
  csatScore: number;
  mysteryShopScore: number;
  warrantyClaimRate: number;
  complianceRating: 'grade_a' | 'grade_b' | 'grade_c' | 'warning';
}

// 7. Customer & Vehicle
export interface Vehicle {
  id: string;
  customerId: string;
  plate: string;
  vin: string;
  brand: string;
  model: string;
  year: number;
  trim: string;
  engineCode: string;
  currentOdometer: number;
  healthScore: number; // 0-100
  lastServiceDate: string;
  nextServiceOdometer: number;
  nextServiceDueDate: string;
  urgentIssuesCount: number;
  pendingRecommendations: {
    urgency: 'now' | 'soon' | 'later';
    title: string;
    reason: string;
    estimatedCost: number;
  }[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  customerType: 'individual' | 'fleet_company' | 'vip';
  vehiclesCount: number;
  totalSpent: number;
  npsScore: number;
  membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// 8. BI & Metrics
export interface BIMetrics {
  gmv: number;
  revenue: number;
  grossMarginPercent: number;
  ordersCompletedToday: number;
  averageOrderValue: number;
  cycleTimeHours: number;
  slaComplianceRate: number;
  ftfr: number;
  reworkRate: number;
  warrantyClaimCost: number;
  activeAlertsCount: number;
}
