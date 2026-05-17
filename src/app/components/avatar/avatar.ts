import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

// A Szerviz importálása (átnevezve, hogy ne ütközzön a komponens nevével)
import { Avatar as AvatarService } from '../../avatar'; 

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
})
export class Avatar implements OnInit, AfterViewInit, OnDestroy {
  // 1. A 3D Vászon (Canvas) elérése a HTML-ből
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  // 2. 🚨 A MÁTRIX SZINKRONIZÁLÓ INJEKTÁLÁSA
  // Publikusra (public) kell tenni, hogy a HTML is lássa és tudjon olvasni a Signalból!
  public avatarService = inject(AvatarService);

  // Three.js belső változók
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private avatarGroup!: THREE.Group; // A holografikus bábú
  private animationFrameId: number = 0;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.init3DSpace();
    this.createHologramAvatar();
    this.animate();
  }

  ngOnDestroy() {
    // Memóriaszivárgás megelőzése kilépéskor
    cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  // --- 1. A 3D TÉR (SZÍNPAD ÉS FÉNYEK) FELÉPÍTÉSE ---
  private init3DSpace() {
    const container = this.rendererContainer.nativeElement;
    
    // Színtér és Köd
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0c0f, 0.05);

    // Kamera
    this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    this.camera.position.set(0, 1.5, 5);

    // Rajzoló motor
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Neon fények (Cyan és Lila)
    const ambientLight = new THREE.AmbientLight(0x222222);
    this.scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f3ff, 2, 10);
    cyanLight.position.set(2, 2, 2);
    this.scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xa200ff, 2, 10);
    purpleLight.position.set(-2, 0, 2);
    this.scene.add(purpleLight);

    // Forgószínpad (Cyberpunk Grid)
    const gridHelper = new THREE.GridHelper(10, 20, 0x00f3ff, 0x222222);
    gridHelper.position.y = -1.5;
    this.scene.add(gridHelper);
  }

  // --- 2. AZ "EMBERKE" (HOLOGRAM DRÓTVÁZ) GENERÁLÁSA ---
  private createHologramAvatar() {
    this.avatarGroup = new THREE.Group();

    const material = new THREE.MeshBasicMaterial({ 
      color: 0x00f3ff, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.5 
    });

    // Fej
    const headGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const head = new THREE.Mesh(headGeo, material);
    head.position.y = 1.2;
    this.avatarGroup.add(head);

    // Test
    const bodyGeo = new THREE.CylinderGeometry(0.4, 0.3, 1.2, 16);
    const body = new THREE.Mesh(bodyGeo, material);
    body.position.y = 0.3;
    this.avatarGroup.add(body);

    this.scene.add(this.avatarGroup);
  }

  // --- 3. FOLYAMATOS ANIMÁCIÓ ---
  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // A bábú lassan forog
    if (this.avatarGroup) {
      this.avatarGroup.rotation.y += 0.005;
    }

    this.renderer.render(this.scene, this.camera);
  };

  // --- 4. TÁRGY FELVÉTELE (A HTML KÁRTYÁK HÍVJÁK MEG) ---
  equipMockItem(cat: 'headgear' | 'top' | 'bottom', name: string, price: number) {
    // Átküldjük az adatot a Service-nek, ami frissíti a Signalt
    this.avatarService.equip({ category: cat, name: name, price: price });
  }
}