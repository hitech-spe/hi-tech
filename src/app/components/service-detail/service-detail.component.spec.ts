import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceDetailComponent } from './service-detail.component';

describe('ServiceDetailComponent', () => {
  let component: ServiceDetailComponent;
  let fixture: ComponentFixture<ServiceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        RouterTestingModule,
        TranslateModule.forRoot(),
        ServiceDetailComponent 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load consulenza-cloud-aziendale with enriched sections, technologies and faqs', () => {
    (component as any).updateService('consulenza-cloud-aziendale');
    fixture.detectChanges();

    expect(component.service).toBeDefined();
    expect(component.service?.id).toBe('consulenza-cloud-aziendale');
    expect(component.service?.sections?.length).toBeGreaterThan(0);
    expect(component.service?.faqs?.length).toBeGreaterThan(0);
    expect(component.service?.technologies?.length).toBeGreaterThan(0);
  });

  it('should inject FAQPage schema in document head when faqs exist', () => {
    (component as any).updateService('consulenza-cloud-aziendale');
    fixture.detectChanges();

    const faqScript = document.getElementById('faq-jsonld-schema') as HTMLScriptElement;
    expect(faqScript).toBeTruthy();
    const parsed = JSON.parse(faqScript.text);
    expect(parsed['@type']).toBe('FAQPage');
    expect(parsed.mainEntity.length).toBeGreaterThan(0);
  });
});
