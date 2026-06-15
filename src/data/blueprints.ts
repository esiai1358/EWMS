import { BlueprintAsset } from '../types';

export const blueprintAssets: BlueprintAsset[] = [
  {
    filename: "DbSchema.sql",
    category: "SQL",
    title: "طرح پایگاه داده SQL Server - جداول و شاخص‌ها",
    description: "کد کامل DDL برای پیاده‌سازی جداول ماژول‌های اسناد، وظایف مهندسی، کاربران و حسابرسی به همراه شاخص‌های کارایی (Performance Indexing)",
    code: `-- =========================================================
-- SYSTEM: EWMS Production Enterprise
-- COMPANY: عمران آذرستان (نیروگاه برق - مهندس اسماعیلی)
-- DATABASE: SQL Server 2022+ / Azure SQL
-- DESCRIPTION: پایگاه داده رابطه‌ای مهندسی کارگاه با جداول تاریخچه تغییرات
-- =========================================================

CREATE DATABASE [EwmsProductionDb];
GO
USE [EwmsProductionDb];
GO

-- 1. جدول کاربران همگام‌سازی شده با اکتیودایرکتوری (Active Directory)
CREATE TABLE [dbo].[Users] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Username] NVARCHAR(100) NOT NULL UNIQUE,
    [FullName] NVARCHAR(250) NOT NULL,
    [Email] NVARCHAR(250) NOT NULL,
    [Position] NVARCHAR(150) NOT NULL,
    [Department] NVARCHAR(100) NOT NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [LastLoginDate] DATETIME NULL,
    [CreatedAt] DATETIME NOT NULL DEFAULT STATISTICTime = GETDATE()
);

-- 2. جدول نقش‌ها و سطوح دسترسی (RBAC)
CREATE TABLE [dbo].[Roles] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL UNIQUE,
    [PersianName] NVARCHAR(150) NOT NULL,
    [Description] NVARCHAR(500) NULL
);

-- جدول نگاشت کاربر به نقش
CREATE TABLE [dbo].[UserRoles] (
    [UserId] INT FOREIGN KEY REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE,
    [RoleId] INT FOREIGN KEY REFERENCES [dbo].[Roles]([Id]) ON DELETE CASCADE,
    PRIMARY KEY ([UserId], [RoleId])
);

-- 3. جدول وظایف مهندسی کارگاهی (Engineering Tasks) برای فرمول‌های کارایی
CREATE TABLE [dbo].[EngineeringTasks] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Title] NVARCHAR(300) NOT NULL,
    [AssignedUserId] INT FOREIGN KEY References [dbo].[Users]([Id]),
    [Priority] NVARCHAR(50) NOT NULL, -- Low, Medium, High
    [Status] NVARCHAR(50) NOT NULL, -- Completed, In Progress, Delayed, Under Review
    [StartDate] DATETIME NOT NULL,
    [DueDate] DATETIME NOT NULL,
    [CompletionDate] DATETIME NULL,
    [ReworkCount] INT NOT NULL DEFAULT 0,
    [QualityScore] DECIMAL(5,2) NOT NULL DEFAULT 100.00, -- 0 to 100
    [EfficiencyScore] DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    [CreatedBy] INT NOT NULL,
    [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE()
);

-- 4. جدول نقشه های کارگاهی (Shop Drawings)
CREATE TABLE [dbo].[ShopDrawings] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [DrawingNo] NVARCHAR(150) NOT NULL UNIQUE,
    [Title] NVARCHAR(300) NOT NULL,
    [Discipline] NVARCHAR(100) NOT NULL, -- Structure, Piping, Mechanical, Electrical
    [Rev] NVARCHAR(20) NOT NULL DEFAULT '0',
    [EngineerId] INT FOREIGN KEY REFERENCES [dbo].[Users]([Id]),
    [Status] NVARCHAR(100) NOT NULL DEFAULT 'Pending',
    [Scale] NVARCHAR(50) NOT NULL,
    [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE()
);

-- 5. جدول گزارش مغایرت‌های کیفی کارگاه (NCR)
CREATE TABLE [dbo].[NcrRecords] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [NcrNo] NVARCHAR(100) NOT NULL UNIQUE,
    [Description] NVARCHAR(MAX) NOT NULL,
    [RootCause] NVARCHAR(MAX) NULL,
    [CorrectiveAction] NVARCHAR(MAX) NULL,
    [Severity] NVARCHAR(50) NOT NULL, -- Minor, Major, Critical
    [QaqcEngineerId] INT FOREIGN KEY REFERENCES [dbo].[Users]([Id]),
    [Status] NVARCHAR(50) NOT NULL, -- Open, Closed, Under Investigation
    [RaisedDate] DATETIME NOT NULL DEFAULT GETDATE(),
    [ClosedDate] DATETIME NULL
);

-- 6. جدول ممیزی فعالیت‌های کاربران (Audit Table)
CREATE TABLE [dbo].[AuditLogs] (
    [Id] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [Username] NVARCHAR(100) NOT NULL,
    [ActionName] NVARCHAR(150) NOT NULL,
    [ModuleName] NVARCHAR(150) NOT NULL,
    [RecordId] NVARCHAR(100) NULL,
    [PayloadBefore] NVARCHAR(MAX) NULL,
    [PayloadAfter] NVARCHAR(MAX) NULL,
    [IpAddress] NVARCHAR(50) NULL,
    [CreatedTimestamp] DATETIME NOT NULL DEFAULT GETDATE()
);

-- ایجاد شاخص‌ها (Indexes) جهت افزایش سرعت جستجوی اسناد و کوئری‌ها
CREATE NONCLUSTERED INDEX [IX_Users_Username] ON [dbo].[Users]([Username]);
CREATE NONCLUSTERED INDEX [IX_EngineeringTasks_Status] ON [dbo].[EngineeringTasks]([Status]);
CREATE NONCLUSTERED INDEX [IX_ShopDrawings_DrawingNo] ON [dbo].[ShopDrawings]([DrawingNo]);
CREATE NONCLUSTERED INDEX [IX_NcrRecords_Status] ON [dbo].[NcrRecords]([Status]);
CREATE NONCLUSTERED INDEX [IX_AuditLogs_Timestamp] ON [dbo].[AuditLogs]([CreatedTimestamp] DESC);
GO`
  },
  {
    filename: "DbViewsAndProcs.sql",
    category: "SQL",
    title: "نماهای محاسباتی و رویه‌های ذخیره شده (Stored Procedures & Views)",
    description: "فرم‌های محاسبات KPI مهندسین ارشد طبق الزامات صورتجلسات فنی مهندس اسماعیلی و پیاده‌سازی خودکار فرمول‌های کیفیت، بازکاری و سرعت در اس‌کیوال سرور",
    code: `-- =========================================================
-- VIEW: محاسبه آنلاین فرمول‌های ارزیابی عملکرد مهندسین کارگاه
-- Quality Index (QI) = QualityScore - (ReworkCount * 5)
-- Performance Index (PI) = QualityScore * (1 - (ReworkCount * 0.1))
-- Efficiency Index (EI) = EfficiencyScore * (PlannedDays / ActualDays)
-- =========================================================

CREATE VIEW [dbo].[vw_EngineerPerformanceSummary]
AS
SELECT 
    u.[Id] AS [UserId],
    u.[FullName] AS [EngineerName],
    u.[Position] AS [Position],
    u.[Department] AS [Department],
    COUNT(t.[Id]) AS [TotalTasks],
    SUM(CASE WHEN t.[Status] = 'Completed' THEN 1 ELSE 0 END) AS [CompletedTasks],
    SUM(CASE WHEN t.[Status] = 'Delayed' THEN 1 ELSE 0 END) AS [DelayedTasks],
    
    -- میانگین خطای بازکاری (Rework Index)
    ISNULL(AVG(CAST(t.[ReworkCount] AS DECIMAL(5,2))), 0) AS [ReworkRatio],
    
    -- محاسبه فرمولی شاخص کیفیت پایه
    ISNULL(AVG(t.[QualityScore] - (t.[ReworkCount] * 5.0)), 0) AS [QualityIndex],
    
    -- محاسبه شاخص عملکرد تلفیقی
    ISNULL(AVG(t.[QualityScore] * (1.0 - (t.[ReworkCount] * 0.10))), 0) AS [PerformanceIndex],
    
    -- محاسبه شاخص راندمان زمانی
    ISNULL(AVG(t.[EfficiencyScore]), 0) AS [EfficiencyIndex],
    
    -- ردیف‌بندی نهایی و رتبه‌بندی کیفی مهندس (Overall Rating)
    CASE 
        WHEN AVG(t.[QualityScore] * (1.0 - (t.[ReworkCount] * 0.10))) >= 90 THEN N'A++ ممتاز'
        WHEN AVG(t.[QualityScore] * (1.0 - (t.[ReworkCount] * 0.10))) >= 75 THEN N'A عالی'
        WHEN AVG(t.[QualityScore] * (1.0 - (t.[ReworkCount] * 0.10))) >= 60 THEN N'B خوب'
        ELSE N'C نیاز به آموزش مجدد'
    END AS [OverallRating]
FROM [dbo].[Users] u
LEFT JOIN [dbo].[EngineeringTasks] t ON u.[Id] = t.[AssignedUserId]
GROUP BY u.[Id], u.[FullName], u.[Position], u.[Department];
GO

-- =========================================================
-- STORED PROCEDURE: ثبت و ممیزی رویدادهای سیستمی
-- =========================================================
CREATE PROCEDURE [dbo].[sp_InsertAuditLog]
    @Username NVARCHAR(100),
    @ActionName NVARCHAR(150),
    @ModuleName NVARCHAR(150),
    @RecordId NVARCHAR(100),
    @PayloadBefore NVARCHAR(MAX),
    @PayloadAfter NVARCHAR(MAX),
    @IpAddress NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO [dbo].[AuditLogs] (
        [Username], [ActionName], [ModuleName], [RecordId], 
        [PayloadBefore], [PayloadAfter], [IpAddress], [CreatedTimestamp]
    )
    VALUES (
        @Username, @ActionName, @ModuleName, @RecordId, 
        @PayloadBefore, @PayloadAfter, @IpAddress, GETDATE()
    );
END;
GO`
  },
  {
    filename: "WorkflowController.cs",
    category: "C#",
    title: "کنترلر گردش کار مبتنی بر ASP.NET Core 8 Web API",
    description: "نمونه کد واقعی کنترلر سی‌شارپ جهت انتقال وضعیت‌های چندمرحله‌ای کارفرما، تایید سرپرست، کنترل اسناد و پروژه با تزریق مستقیم وابستگی سرویس‌ها",
    code: `/* =========================================================
 * SYSTEM: EWMS Production Enterprise
 * DEVELOPED BY: مهندس مهدی اسماعیلی - عمران آذرستان
 * FRAMEWORK: ASP.NET Core 8.0 Minimal APIs / Web API
 * SECURITY: Standard JWT and Active Directory Authorization
 * ========================================================= */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Ewms.Enterprise.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WorkflowController : ControllerBase
    {
        private readonly IWorkflowService _workflowService;
        private readonly ILogger<WorkflowController> _logger;

        public WorkflowController(IWorkflowService workflowService, ILogger<WorkflowController> logger)
        {
            _workflowService = workflowService;
            _logger = logger;
        }

        /// <summary>
        /// دریافت تمامی فرآیندهای جاری و کارتابل مهندسی
        /// </summary>
        [HttpGet("inbox")]
        public async Task<IActionResult> GetMyInbox()
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized(new { message = "شماره احراز هویت نامعتبر است." });
            }

            var inbox = await _workflowService.GetInboxForUserAsync(username);
            return Ok(inbox);
        }

        /// <summary>
        /// ثبت درخواست گردش کار جدید در پروژه نیروگاه برق عمران آذرستان
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> CreateRequest([FromBody] WorkflowRequestDto dto)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var result = await _workflowService.CreateWorkflowAsync(dto, username);
            _logger.LogInformation("Workflow request {Id} successfully created by {User}", result.Id, username);
            
            return CreatedAtAction(nameof(GetDetails), new { id = result.Id }, result);
        }

        /// <summary>
        /// ارسال بازخورد تایید، رد یا مرجوع اسناد به همراه توضیحات
        /// </summary>
        [HttpPost("{id}/action")]
        public async Task<IActionResult> ProcessAction(int id, [FromBody] WorkflowActionDto dto)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            
            try
            {
                var response = await _workflowService.ProcessStepAsync(id, dto, username);
                return Ok(new { 
                    message = "اقدام گردش کار با موفقیت ثبت نهایی شد.", 
                    currentStep = response.CurrentStep, 
                    status = response.Status 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing workflow action on Id {Id}", id);
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetails(int id)
        {
            var details = await _workflowService.GetDetailsAsync(id);
            if (details == null) return NotFound(new { message = "درخواست گردش کار یافت نشد." });
            return Ok(details);
        }
    }

    public class WorkflowRequestDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string DocumentType { get; set; } = string.Empty;
        public Dictionary<string, string> MetaData { get; set; } = new();
    }

    public class WorkflowActionDto
    {
        public string ActionType { get; set; } = "Approve"; // Approve, Reject, Return, Escalate, Delegate
        public string Comment { get; set; } = string.Empty;
        public string? DelegateToUser { get; set; }
    }
}`
  },
  {
    filename: "FlowableBpmEngine.bpmn20.xml",
    category: "BPMN",
    title: "ساختار موتور گردش کار Flowable (BPMN 2.0 XML)",
    description: "کد توصیف گرافیکی گردش کار مهندسی پروژه عمران آذرستان بر اساس استاندارد BPMN 2.0 برای موتور Flowable یا Camunda",
    code: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xmlns:flowable="http://flowable.org/bpmn"
             targetNamespace="http://azarestan.com/ewms"
             expressionLanguage="http://www.w3.org/1999/XPath">

  <process id="ewmsEngineeringWorkflow" name="EWMS Engineering Approval Flow" isExecutable="true">
    
    <!-- نقطه شروع فرآیند گردش کار -->
    <startEvent id="startRequest" name="ثبت درخواست جدید" />
    
    <!-- ۱. مرحله بررسی مدیر پروژه -->
    <userTask id="managerReview" name="بررسی و تایید مدیر پروژه" flowable:candidateGroups="ProjectManagers" />
    <sequenceFlow id="flow1" sourceRef="startRequest" targetRef="managerReview" />

    <!-- ۲. ارجاع مهندس ارشد فنی جهت ارزیابی محاسباتی -->
    <userTask id="seniorEngineerReview" name="کنترل محاسبات مهندس ارشد" flowable:candidateGroups="SeniorEngineers" />
    <sequenceFlow id="flow2" sourceRef="managerReview" targetRef="seniorEngineerReview" />

    <!-- ۳. بررسی جزئیات مهندس طراح کارگاه -->
    <userTask id="engineerCheck" name="بررسی نقشه مهندس کارگاه" flowable:candidateGroups="Engineers" />
    <sequenceFlow id="flow3" sourceRef="seniorEngineerReview" targetRef="engineerCheck" />

    <!-- دزدگیر منطقی گیت‌وی جهت بررسی کیفیت و عیار استاندارد -->
    <exclusiveGateway id="qualityGate" name="آیا نیاز به تضمین کیفیت دارد؟" />
    <sequenceFlow id="flow4" sourceRef="engineerCheck" targetRef="qualityGate" />

    <!-- ۴. مرحله بررسی کنترلی تضمین کیفیت QA/QC -->
    <userTask id="qaqcReview" name="بازرسی کیفی و بازکاری QA/QC" flowable:candidateGroups="QaqcInspectors" />
    <sequenceFlow id="flowQual" sourceRef="qualityGate" targetRef="qaqcReview">
      <conditionExpression xsi:type="tFormalExpression">\${requireQaqc == true}</conditionExpression>
    </sequenceFlow>

    <!-- ۵. ثبت ترانسمیتال و کلاسه اسناد در DCC -->
    <userTask id="docControl" name="پرونده سازی و بایگانی در DCC" flowable:candidateGroups="DccOperators" />
    <sequenceFlow id="flow5" sourceRef="qaqcReview" targetRef="docControl" />
    <sequenceFlow id="flowNoQual" sourceRef="qualityGate" targetRef="docControl">
      <conditionExpression xsi:type="tFormalExpression">\${requireQaqc == false}</conditionExpression>
    </sequenceFlow>

    <!-- ۶. ارزیابی زمانی و تاخیرات در واحد کنترل پروژه -->
    <userTask id="projControl" name="تحلیل برنامه زمان‌بندی MSP" flowable:candidateGroups="ProjectControl" />
    <sequenceFlow id="flow6" sourceRef="docControl" targetRef="projControl" />

    <!-- ۷. امضا و تاییدیه نهایی رئیس کارگاه نیروگاه -->
    <userTask id="finalApproval" name="تایید نهایی و امضای الکترونیکی" flowable:candidateGroups="SiteManager" />
    <sequenceFlow id="flow7" sourceRef="projControl" targetRef="finalApproval" />

    <!-- انتهای مسیر موفقیت آمیز گردش کار -->
    <endEvent id="endRequest" name="پایان فرآیند - سند مصوب و صادر شد" />
    <sequenceFlow id="flow8" sourceRef="finalApproval" targetRef="endRequest" />

  </process>
</definitions>`
  },
  {
    filename: "IisConfiguration_Web.config",
    category: "Config",
    title: "تنظیمات وب‌سرور IIS و پروکسی سرور معکوس",
    description: "تنظیمات فایل Web.config جهت پیاده‌سازی گیت‌وی، هدایت دامنه داخلی وب هاستینگ، فعال کردن هدرهای امنیتی OWASP و فعال کردن CORS در اینترانت شرکت عمران آذرستان",
    code: `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath="dotnet" arguments=".\\\\Ewms.Enterprise.Api.dll" stdoutLogEnabled="true" stdoutLogFile=".\\\\logs\\\\stdout" hostingModel="inprocess" />
      
      <!-- هدرهای امنیتی جهت سخت‌کاری محیط تولید (OWASP Hardening Headers) -->
      <httpProtocol>
        <customHeaders>
          <add name="X-Frame-Options" value="SAMEORIGIN" />
          <add name="X-XSS-Protection" value="1; mode=block" />
          <add name="X-Content-Type-Options" value="nosniff" />
          <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
          <add name="Content-Security-Policy" value="default-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com;" />
        </customHeaders>
      </httpProtocol>
      
      <!-- افزایش حداکثر حجم فایل فیزیکی آپلود اسناد به همراه پیوست‌های نقشه تا سقف ۳۰۰ مگابایت -->
      <security>
        <requestFiltering>
          <requestLimits maxAllowedContentLength="314572800" />
        </requestFiltering>
      </security>
    </system.webServer>
  </location>
</configuration>`
  }
];
