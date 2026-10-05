export interface OdooCodeFile {
  filename: string;
  language: 'python' | 'xml' | 'csv';
  description: string;
  code: string;
}

export const ODOO_CODE_FILES: OdooCodeFile[] = [
  {
    filename: '__manifest__.py',
    language: 'python',
    description: 'فایل مانیفست رسمی ماژول اودو ۱۹ (Odoo 19 Module Manifest)',
    code: `# -*- coding: utf-8 -*-
{
    'name': 'Odoo AutoCore ERP - مدیریت خدمات خودرویی و پروژه‌های مشتریان',
    'version': '19.0.1.0.0',
    'summary': 'ماژول اختصاصی مدیریت ۹۸ فرآیند خدمات خودرو، لاین‌های تعمیرگاه، انبار، خرید، مالی، فرانچایز و پاسپورت سلامت',
    'description': """
ماژول جامع مدیریت خدمات خودرویی و ناوگان (Automotive & Workshop ERP):
========================================================================
- ۸ دامنه تخصصی و ۹۸ ماژول فرآیندی منطبق با استانداردهای Odoo 19 Backend
- مدیریت یکپارچه چرخه سفارش (Order -> Bay Assignment -> Inspection -> Execution -> QC -> Invoicing)
- پاسپورت دیجیتال سلامت خودرو و گزارش انتقال مالکیت (Resale QR Report)
- کنترل لحظه‌ای لاین‌های تعمیرگاهی (Bays) و تخصیص هوشمند تکنسین
- کنترل دقیق قطعات، کد ردیابی لات/سریال و اصالت ضدتقلب QR
- تسویه حساب شفاف شرکای فرانچایز با کسر کارمزد پلتفرم و ذخیره گارانتی
    """,
    'author': 'Odoo Full-Stack Auto Engineering Team',
    'website': 'https://www.odoo.com',
    'category': 'Services/Automotive',
    'license': 'LGPL-3',
    'depends': [
        'base',
        'mail',
        'fleet',
        'stock',
        'purchase',
        'account',
        'hr',
        'resource',
    ],
    'data': [
        'security/auto_security.xml',
        'security/ir.model.access.csv',
        'data/service_package_data.xml',
        'data/sequence_data.xml',
        'views/auto_service_order_views.xml',
        'views/workshop_bay_views.xml',
        'views/vehicle_passport_views.xml',
        'views/spare_parts_views.xml',
        'views/partner_franchise_views.xml',
        'views/bi_dashboard_views.xml',
        'views/menu_views.xml',
        'reports/vehicle_health_report_template.xml',
        'reports/service_invoice_template.xml',
    ],
    'demo': [
        'demo/auto_demo_data.xml',
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'assets': {
        'web.assets_backend': [
            'odoo_autocore/static/src/scss/workshop_kanban.scss',
            'odoo_autocore/static/src/js/bay_planner_widget.js',
            'odoo_autocore/static/src/xml/bay_planner_template.xml',
        ],
    },
}
`
  },
  {
    filename: 'models/auto_service_order.py',
    language: 'python',
    description: 'مدل پایتون هسته سفارش کار خودرو (Python Model: auto.service.order)',
    code: `# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError, UserError
from datetime import timedelta

class AutoServiceOrder(models.Model):
    _name = 'auto.service.order'
    _description = 'سفارش خدمات و تعمیرات خودرو (Auto Service Work Order)'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'priority desc, appointment_time desc, id desc'

    name = fields.Char(
        string='شماره سفارش',
        required=True,
        copy=False,
        readonly=True,
        default=lambda self: _('جدید'),
        tracking=True
    )
    partner_id = fields.Many2one(
        'res.partner',
        string='مشتری / مالک',
        required=True,
        tracking=True
    )
    partner_phone = fields.Char(related='partner_id.phone', string='شماره تماس')
    vehicle_id = fields.Many2one(
        'fleet.vehicle',
        string='خودرو',
        required=True,
        domain="[('driver_id', '=', partner_id)]",
        tracking=True
    )
    license_plate = fields.Char(related='vehicle_id.license_plate', string='شماره پلاک')
    branch_id = fields.Many2one(
        'res.branch',
        string='شعبه / تعمیرگاه',
        required=True,
        default=lambda self: self.env.user.branch_id,
        tracking=True
    )
    bay_id = fields.Many2one(
        'workshop.bay',
        string='لاین تعمیرگاهی (Bay)',
        domain="[('branch_id', '=', branch_id), ('status', 'in', ['available', 'reserved'])]",
        tracking=True
    )
    technician_id = fields.Many2one(
        'hr.employee',
        string='تکنسین مسئول',
        domain="[('is_auto_technician', '=', True), ('branch_id', '=', branch_id)]",
        tracking=True
    )
    state = fields.Selection([
        ('draft', 'پیش‌نویس'),
        ('appointment', 'نوبت‌دهی‌شده'),
        ('accepted', 'پذیرش شده'),
        ('assigned', 'تخصیص به لاین'),
        ('checked_in', 'ورود به سالن (Check-in)'),
        ('inspecting', 'کارشناسی و بازرسی'),
        ('in_progress', 'در حال انجام'),
        ('change_order', 'در انتظار تأیید الحاقیه'),
        ('qc_pending', 'کنترل کیفیت نهایی'),
        ('done', 'انجام شده'),
        ('invoiced', 'فاکتور صادر شد'),
        ('delivered', 'تحویل مشتری گردید'),
        ('cancelled', 'لغو شده'),
    ], string='وضعیت گردش کار', default='draft', tracking=True)

    priority = fields.Selection([
        ('0', 'عادی'),
        ('1', 'بالا'),
        ('2', 'بحرانی / امدادی'),
    ], string='اولویت', default='0', tracking=True)

    appointment_time = fields.Datetime(string='زمان نوبت')
    check_in_time = fields.Datetime(string='زمان ورود فیزیکی')
    start_time = fields.Datetime(string='زمان شروع تعمیر')
    end_time = fields.Datetime(string='زمان اتمام')

    sla_limit_minutes = fields.Integer(string='سقف زمان SLA (دقیقه)', default=90)
    elapsed_minutes = fields.Integer(string='زمان سپری شده (دقیقه)', compute='_compute_elapsed_time')
    sla_breached = fields.Boolean(string='نقض SLA', compute='_compute_sla_breached', store=True)

    service_line_ids = fields.One2many(
        'auto.service.order.line',
        'order_id',
        string='اقلام خدمات و قطعات'
    )
    change_order_ids = fields.One2many(
        'auto.change.order',
        'order_id',
        string='سفارش‌های تغییر و کارهای اضافه'
    )
    inspection_id = fields.Many2one('auto.vehicle.inspection', string='فرم بازرسی اولیه')

    labor_total = fields.Monetary(string='مجموع اجرت', compute='_compute_totals', store=True)
    parts_total = fields.Monetary(string='مجموع قطعات', compute='_compute_totals', store=True)
    amount_total = fields.Monetary(string='مبلغ کل سفارش', compute='_compute_totals', store=True)
    currency_id = fields.Many2one('res.currency', string='ارز', default=lambda self: self.env.company.currency_id)

    invoice_id = fields.Many2one('account.move', string='فاکتور مالی', readonly=True)

    @api.model
    def create(self, vals):
        if vals.get('name', _('جدید')) == _('جدید'):
            vals['name'] = self.env['ir.sequence'].next_by_code('auto.service.order') or _('جدید')
        return super(AutoServiceOrder, self).create(vals)

    @api.depends('service_line_ids.price_subtotal', 'change_order_ids.total_amount', 'change_order_ids.state')
    def _compute_totals(self):
        for rec in self:
            labor = sum(l.price_subtotal for l in rec.service_line_ids if l.service_type == 'labor')
            parts = sum(l.price_subtotal for l in rec.service_line_ids if l.service_type == 'part')
            # Add approved change orders
            for co in rec.change_order_ids.filtered(lambda c: c.state == 'approved'):
                labor += co.labor_amount
                parts += co.parts_amount
            rec.labor_total = labor
            rec.parts_total = parts
            rec.amount_total = labor + parts

    @api.depends('start_time', 'end_time', 'sla_limit_minutes')
    def _compute_sla_breached(self):
        for rec in self:
            if rec.start_time and rec.end_time:
                duration = (rec.end_time - rec.start_time).total_seconds() / 60.0
                rec.sla_breached = duration > rec.sla_limit_minutes
            else:
                rec.sla_breached = False

    def action_confirm_appointment(self):
        self.write({'state': 'appointment'})

    def action_accept_order(self):
        self.write({'state': 'accepted'})

    def action_assign_bay(self):
        self.ensure_one()
        if not self.bay_id:
            raise UserError(_('لطفاً پیش از انتقال، یک لاین تعمیرگاهی خالی انتخاب نمایید.'))
        self.bay_id.write({'status': 'occupied', 'current_order_id': self.id})
        self.write({'state': 'assigned'})

    def action_check_in(self):
        self.write({'state': 'checked_in', 'check_in_time': fields.Datetime.now()})

    def action_start_inspection(self):
        self.write({'state': 'inspecting'})

    def action_start_execution(self):
        self.ensure_one()
        # Reserve required spare parts from warehouse
        for line in self.service_line_ids.filtered(lambda l: l.service_type == 'part' and l.product_id):
            line.product_id.action_reserve_stock(line.qty, self.branch_id.warehouse_id)
        self.write({'state': 'in_progress', 'start_time': fields.Datetime.now()})

    def action_request_change_order(self):
        self.write({'state': 'change_order'})

    def action_send_to_qc(self):
        self.write({'state': 'qc_pending'})

    def action_qc_pass(self):
        self.ensure_one()
        self.write({
            'state': 'done',
            'end_time': fields.Datetime.now()
        })
        if self.bay_id:
            self.bay_id.write({'status': 'available', 'current_order_id': False})
        # Update vehicle digital health passport
        if self.vehicle_id:
            self.vehicle_id._update_health_passport_after_service(self)

    def action_create_invoice(self):
        self.ensure_one()
        invoice_vals = {
            'move_type': 'out_invoice',
            'partner_id': self.partner_id.id,
            'branch_id': self.branch_id.id,
            'invoice_date': fields.Date.context_today(self),
            'invoice_line_ids': [
                (0, 0, {
                    'name': line.name,
                    'product_id': line.product_id.id if line.product_id else False,
                    'quantity': line.qty,
                    'price_unit': line.price_unit,
                }) for line in self.service_line_ids
            ]
        }
        invoice = self.env['account.move'].create(invoice_vals)
        self.write({'invoice_id': invoice.id, 'state': 'invoiced'})
        return {
            'name': _('فاکتور مشتری'),
            'type': 'ir.actions.act_window',
            'res_model': 'account.move',
            'res_id': invoice.id,
            'view_mode': 'form',
        }
`
  },
  {
    filename: 'views/auto_service_order_views.xml',
    language: 'xml',
    description: 'نمای فرم، لیست و کانبان اودو ۱۹ (XML Views with Statusbar & Notebook)',
    code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <!-- Tree View -->
    <record id="view_auto_service_order_tree" model="ir.ui.view">
        <name>auto.service.order.tree</name>
        <model>auto.service.order</model>
        <arch type="xml">
            <list string="سفارشات خدمات خودرو" decoration-danger="sla_breached" decoration-info="state == 'in_progress'" decoration-success="state == 'done'">
                <field name="name"/>
                <field name="partner_id"/>
                <field name="vehicle_id"/>
                <field name="license_plate"/>
                <field name="branch_id"/>
                <field name="bay_id"/>
                <field name="technician_id"/>
                <field name="priority" widget="priority"/>
                <field name="amount_total" widget="monetary"/>
                <field name="state" widget="badge" decoration-info="state in ('appointment', 'accepted')" decoration-warning="state in ('in_progress', 'change_order')" decoration-success="state in ('done', 'invoiced')"/>
                <field name="sla_breached" widget="boolean_toggle"/>
            </list>
        </arch>
    </record>

    <!-- Form View with Odoo 19 Header Statusbar -->
    <record id="view_auto_service_order_form" model="ir.ui.view">
        <name>auto.service.order.form</name>
        <model>auto.service.order</model>
        <arch type="xml">
            <form string="سفارش کار خدمات خودرو">
                <header>
                    <button name="action_accept_order" string="پذیرش سفارش" type="object" invisible="state != 'appointment'" class="oe_highlight"/>
                    <button name="action_assign_bay" string="تخصیص لاین و تکنسین" type="object" invisible="state != 'accepted'" class="oe_highlight"/>
                    <button name="action_check_in" string="ثبت ورود (Check-in)" type="object" invisible="state != 'assigned'" class="oe_highlight"/>
                    <button name="action_start_inspection" string="شروع بازرسی OBD و بدنه" type="object" invisible="state != 'checked_in'" class="oe_highlight"/>
                    <button name="action_start_execution" string="شروع تعمیرات در لاین" type="object" invisible="state != 'inspecting'" class="oe_highlight"/>
                    <button name="action_send_to_qc" string="ارسال به کنترل کیفیت (QC)" type="object" invisible="state != 'in_progress'" class="oe_highlight"/>
                    <button name="action_qc_pass" string="تأیید کنترل کیفیت و ترخیص" type="object" invisible="state != 'qc_pending'" class="btn-success"/>
                    <button name="action_create_invoice" string="صدور فاکتور مشتری" type="object" invisible="state != 'done'" class="oe_highlight"/>
                    
                    <field name="state" widget="statusbar" statusbar_visible="draft,accepted,assigned,in_progress,qc_pending,done,invoiced"/>
                </header>
                <sheet>
                    <div class="oe_button_box" name="button_box">
                        <button name="action_view_invoice" type="object" class="oe_stat_button" icon="fa-pencil-square-o" invisible="not invoice_id">
                            <field name="invoice_id" widget="statinfo" string="فاکتور"/>
                        </button>
                    </div>
                    <div class="oe_title">
                        <h1>
                            <field name="name"/>
                        </h1>
                    </div>
                    <group>
                        <group string="اطلاعات مشتری و خودرو">
                            <field name="partner_id"/>
                            <field name="partner_phone"/>
                            <field name="vehicle_id"/>
                            <field name="license_plate"/>
                        </group>
                        <group string="تخصیص کارگاه و زمان‌بندی">
                            <field name="branch_id"/>
                            <field name="bay_id"/>
                            <field name="technician_id"/>
                            <field name="priority" widget="priority"/>
                            <field name="sla_limit_minutes"/>
                            <field name="sla_breached"/>
                        </group>
                    </group>
                    
                    <notebook>
                        <page string="اقلام خدمات و قطعات مصرفی">
                            <field name="service_line_ids">
                                <list editable="bottom">
                                    <field name="service_type"/>
                                    <field name="product_id"/>
                                    <field name="name"/>
                                    <field name="qty"/>
                                    <field name="price_unit"/>
                                    <field name="price_subtotal"/>
                                </list>
                            </field>
                            <group class="oe_subtotal_footer oe_right">
                                <field name="labor_total"/>
                                <field name="parts_total"/>
                                <field name="amount_total" class="oe_subtotal_footer_separator"/>
                            </group>
                        </page>
                        <page string="تغییرات سفارش (Change Orders)">
                            <field name="change_order_ids"/>
                        </page>
                        <page string="پاسپورت و کارشناسی خودرو">
                            <field name="inspection_id"/>
                        </page>
                    </notebook>
                </sheet>
                <chatter/>
            </form>
        </arch>
    </record>

    <!-- Action -->
    <record id="action_auto_service_order" model="ir.actions.act_window">
        <name>سفارش‌های خدمات خودرو</name>
        <res_model>auto.service.order</res_model>
        <view_mode>list,kanban,form,calendar,pivot,graph</view_mode>
        <context>{}</context>
    </record>
</odoo>
`
  },
  {
    filename: 'controllers/main.py',
    language: 'python',
    description: 'کنترلر REST/JSON-RPC برای اپ موبایل مشتری و تبلت تکنسین (Odoo 19 Controller)',
    code: `# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request

class AutoCoreApiController(http.Controller):

    @http.route('/api/v1/auto/orders', type='json', auth='user', methods=['POST'], csrf=False)
    def create_order(self, **kwargs):
        """ثبت سفارش نوبت از اپلیکیشن موبایل مشتری"""
        user = request.env.user
        partner = user.partner_id
        vehicle_id = kwargs.get('vehicle_id')
        service_package_id = kwargs.get('service_package_id')
        branch_id = kwargs.get('branch_id')

        order = request.env['auto.service.order'].create({
            'partner_id': partner.id,
            'vehicle_id': vehicle_id,
            'branch_id': branch_id,
            'state': 'appointment',
            'priority': kwargs.get('priority', '0'),
            'appointment_time': kwargs.get('appointment_time'),
        })

        return {
            'status': 'success',
            'order_id': order.id,
            'order_number': order.name,
            'tracking_url': f"/my/auto/orders/{order.id}"
        }

    @http.route('/api/v1/auto/vehicle/passport/<string:vin>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_public_passport(self, vin, **kwargs):
        """استعلام پاسپورت دیجیتال سلامت خودرو از طریق اسکن بارکد QR معامله"""
        vehicle = request.env['fleet.vehicle'].sudo().search([('vin', '=', vin)], limit=1)
        if not vehicle:
            return request.render('odoo_autocore.passport_not_found', {})
        
        return request.render('odoo_autocore.public_vehicle_health_passport', {
            'vehicle': vehicle,
            'health_score': vehicle.health_score,
            'services': vehicle.service_history_ids,
            'active_warranty': vehicle.active_warranty_id,
        })
`
  },
  {
    filename: 'security/ir.model.access.csv',
    language: 'csv',
    description: 'قوانین و سطوح دسترسی امنیتی اودو (Model Access Permissions)',
    code: `id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_auto_service_order_user,auto.service.order.user,model_auto_service_order,base.group_user,1,1,1,0
access_auto_service_order_manager,auto.service.order.manager,model_auto_service_order,odoo_autocore.group_auto_manager,1,1,1,1
access_workshop_bay_user,workshop.bay.user,model_workshop_bay,base.group_user,1,0,0,0
access_workshop_bay_manager,workshop.bay.manager,model_workshop_bay,odoo_autocore.group_auto_manager,1,1,1,1
access_auto_vehicle_passport_user,auto.vehicle.passport.user,model_auto_vehicle_passport,base.group_user,1,0,0,0
access_auto_vehicle_passport_manager,auto.vehicle.passport.manager,model_auto_vehicle_passport,odoo_autocore.group_auto_manager,1,1,1,1
access_auto_change_order_user,auto.change.order.user,model_auto_change_order,base.group_user,1,1,1,0
access_auto_change_order_manager,auto.change.order.manager,model_auto_change_order,odoo_autocore.group_auto_manager,1,1,1,1
`
  }
];
