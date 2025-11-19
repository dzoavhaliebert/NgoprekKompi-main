// translations.js - LANGUAGE TRANSLATION DATABASE
// Database terjemahan untuk bahasa Indonesia dan Inggris

const translations = {
    id: {
        // Navbar
        nav: {
            brand: "NgoPi",
            home: "Home",
            build: "Rakit PC",
            recommend: "Rekomendasi",
            disclaimer: "Disclaimer",
            contact: "Kontak"
        },
        
        // Home Page
        home: {
            hero: {
                title: "RAKIT PC IMPIANMU DENGAN<br>MUDAH DAN PROFESIONAL",
                subtitle: "Merakit PC menjadi mudah, tanpa ribet, dan profesional sesuai dengan<br>kebutuhan dan budget Anda.",
                cta: "Simulasi Rakit PC"
            },
            features: {
                title: "Fitur Unggulan",
                subtitle: "Semua yang Anda butuhkan untuk merakit PC sempurna",
                budget: {
                    title: "Kalkulator Budget",
                    desc: "Perhitungan harga real-time dengan filter budget cerdas dan saran optimasi biaya"
                },
                compatibility: {
                    title: "Cek Kompatibilitas",
                    desc: "Deteksi otomatis komponen yang tidak kompatibel dengan solusi dan rekomendasi detail"
                },
                performance: {
                    title: "Analisis Performa",
                    desc: "Lihat estimasi benchmark dan performa gaming di berbagai resolusi"
                },
                save: {
                    title: "Simpan Konfigurasi",
                    desc: "Simpan dan kelola berbagai konfigurasi build dengan fungsi export"
                },
                compare: {
                    title: "Bandingkan Build",
                    desc: "Bandingkan berbagai build secara berdampingan untuk menemukan konfigurasi terbaik"
                },
                smart: {
                    title: "Rekomendasi Cerdas",
                    desc: "Saran build yang sudah dikonfigurasi sesuai berbagai kebutuhan dan budget"
                }
            },
            cta: {
                title: "Siap Merakit PC?",
                subtitle: "Mulai konfigurasi PC impian Anda dengan tools profesional kami",
                button: "Mulai Sekarang"
            }
        },
        
        // Build Page
        build: {
            sidebar: {
                budget: "Kalkulator Budget",
                budgetMin: "Budget Minimum",
                budgetMax: "Budget Maximum",
                summary: "Ringkasan Build",
                totalPrice: "Total Harga",
                savedBuilds: "Build Tersimpan"
            },
            actions: {
                analysis: "Analisis Performa",
                save: "Simpan Build",
                print: "Print Ringkasan",
                reset: "Reset Semua"
            },
            components: {
                cpu: "Processor (CPU)",
                mb: "Motherboard",
                ram: "Memory (RAM)",
                vga: "Graphics Card (GPU)",
                storage: "Storage (SSD)",
                psu: "Power Supply (PSU)",
                case: "Case",
                cooling: "Sistem Pendingin",
                os: "Operating System",
                selectPlaceholder: "Pilih"
            },
            compatibility: {
                critical: "Masalah Kritis",
                warning: "Peringatan",
                success: "Semua Sistem Kompatibel",
                noIssues: "Tidak ada masalah kompatibilitas terdeteksi. Build Anda siap untuk dirakit."
            },
            budget: {
                exceeded: "Melebihi Budget",
                excess: "Kelebihan",
                nearLimit: "Mendekati Batas Budget",
                remaining: "Sisa",
                withinBudget: "Dalam Budget"
            },
            modal: {
                performance: "Analisis Performa",
                subtitle: "Estimasi benchmark berdasarkan komponen yang dipilih",
                gaming: "Performa Gaming",
                usecase: "Performa Berdasarkan Penggunaan",
                overall: "Rating Sistem Keseluruhan",
                benchmarks: "Referensi Video Benchmark",
                note: "Skor benchmark adalah estimasi dan dapat bervariasi tergantung konfigurasi sistem, driver, dan kondisi penggunaan."
            },
            empty: {
                title: "Belum ada build tersimpan",
                subtitle: "Mulai merakit dan simpan konfigurasi Anda"
            }
        },
        
        // Recommendation Page
        recommend: {
            title: "Rekomendasi Build PC",
            subtitle: "Konfigurasi siap pakai untuk berbagai kebutuhan dan budget",
            presets: {
                office: {
                    title: "Produktivitas Kantor",
                    badge: "Business"
                },
                school: {
                    title: "PC Sekolah / Belajar",
                    badge: "Education"
                },
                budget: {
                    title: "Entry Level Gaming",
                    badge: "Budget"
                },
                gaming: {
                    title: "Gaming Performa Tinggi",
                    badge: "Gaming"
                },
                editing: {
                    title: "Content Creation",
                    badge: "Professional"
                },
                server: {
                    title: "Server / Workstation",
                    badge: "Workstation"
                }
            },
            guide: {
                title: "Panduan Komponen PC",
                subtitle: "Memahami fungsi setiap komponen dalam sistem PC Anda",
                cpu: {
                    title: "Processor (CPU)",
                    desc: "Otak dari komputer yang memproses semua instruksi. CPU yang lebih cepat menghasilkan performa sistem yang lebih responsif."
                },
                mb: {
                    title: "Motherboard",
                    desc: "Papan sirkuit utama yang menghubungkan semua komponen. Harus kompatibel dengan socket CPU yang dipilih."
                },
                ram: {
                    title: "Memory (RAM)",
                    desc: "Penyimpanan sementara untuk data yang sedang diproses. RAM lebih banyak memungkinkan multitasking lebih lancar."
                },
                vga: {
                    title: "Graphics Card (GPU)",
                    desc: "Memproses grafis dan visual. Sangat penting untuk gaming dan rendering video dengan kualitas tinggi."
                },
                storage: {
                    title: "Storage (SSD)",
                    desc: "Menyimpan sistem operasi, program, dan file. SSD jauh lebih cepat dari HDD tradisional."
                },
                psu: {
                    title: "Power Supply (PSU)",
                    desc: "Menyuplai daya ke semua komponen. Watt yang cukup dan efisiensi tinggi sangat penting."
                }
            },
            button: "Muat Konfigurasi"
        },
        
        // Disclaimer Page (LENGKAP)
        disclaimer: {
            title: "Disclaimer, K3LH & Panduan Perakitan",
            subtitle: "Informasi penting sebelum merakit PC Anda",
            assembly: {
                title: "Tata Cara Perakitan PC",
                step1: {
                    title: "Persiapan",
                    desc: "Siapkan semua komponen, alat, dan manual. Pasang gelang anti-statis dan pastikan area kerja bersih."
                },
                step2: {
                    title: "Install CPU ke Motherboard",
                    desc: "Buka socket CPU, sejajarkan marking/triangle, letakkan CPU dengan hati-hati, dan kunci socket."
                },
                step3: {
                    title: "Pasang CPU Cooler",
                    desc: "Aplikasikan thermal paste (jika perlu), pasang cooler sesuai panduan, dan sambungkan kabel fan ke motherboard."
                },
                step4: {
                    title: "Install RAM",
                    desc: "Buka klip RAM slot, sejajarkan notch di RAM dengan slot, tekan hingga klip terkunci otomatis."
                },
                step5: {
                    title: "Install I/O Shield & Motherboard",
                    desc: "Pasang I/O shield di casing, letakkan motherboard, sejajarkan dengan standoff, kencangkan sekrup."
                },
                step6: {
                    title: "Pasang Storage (SSD/HDD)",
                    desc: "Untuk M.2 SSD: masukkan ke slot M.2 dengan sudut 30°, tekan dan kencangkan sekrup. Untuk SATA: sambungkan kabel data dan power."
                },
                step7: {
                    title: "Install Graphics Card",
                    desc: "Lepas slot cover di casing, sejajarkan GPU dengan PCIe x16 slot, tekan hingga klik, kencangkan bracket."
                },
                step8: {
                    title: "Pasang Power Supply",
                    desc: "Letakkan PSU di bracket (fan menghadap keluar/bawah), kencangkan sekrup, sambungkan kabel modular jika ada."
                },
                step9: {
                    title: "Cable Management",
                    desc: "Sambungkan kabel: 24-pin ATX, 8-pin CPU, PCIe untuk GPU, SATA, front panel connectors. Rapikan dengan cable ties."
                },
                step10: {
                    title: "Final Check & Power On",
                    desc: "Cek ulang semua koneksi, pasang side panel, sambungkan monitor, keyboard, mouse. Nyalakan dan masuk BIOS untuk verifikasi."
                }
            },
            considerations: {
                title: "Pertimbangan Penting",
                socket: {
                    title: "Kompatibilitas Socket",
                    desc: "CPU Intel memerlukan motherboard Intel (LGA1700), CPU AMD memerlukan motherboard AMD (AM5)"
                },
                psu: {
                    title: "Kapasitas PSU",
                    desc: "Hitung total konsumsi daya (TDP) semua komponen, tambahkan margin 20-30% untuk keamanan"
                },
                ram: {
                    title: "Tipe RAM",
                    desc: "Platform Intel Gen 13/14 dan AMD Ryzen 7000 mendukung DDR5. Platform lama menggunakan DDR4"
                },
                case: {
                    title: "Ukuran Case",
                    desc: "Pastikan GPU panjang dan CPU cooler tinggi muat di dalam case"
                },
                cooling: {
                    title: "Pendinginan",
                    desc: "Case dengan good airflow dan CPU cooler yang memadai penting untuk stabilitas"
                },
                warranty: {
                    title: "Garansi",
                    desc: "Simpan struk dan kemasan untuk klaim garansi (biasanya 1-3 tahun)"
                },
                bios: {
                    title: "BIOS Update",
                    desc: "Beberapa motherboard mungkin perlu update BIOS untuk CPU terbaru"
                }
            },
            safety: {
                title: "Keselamatan & Kesehatan Kerja (K3)",
                workspace: {
                    title: "Area Kerja",
                    desc: "Pastikan area kerja bersih, kering, dengan pencahayaan memadai dan ventilasi baik"
                },
                antistatic: {
                    title: "Anti-Static",
                    desc: "Gunakan gelang anti-statis (ESD wrist strap) untuk melindungi komponen dari kerusakan elektrostatis"
                },
                electricity: {
                    title: "Kelistrikan",
                    desc: "Selalu matikan dan cabut kabel daya sebelum memulai perakitan"
                },
                handling: {
                    title: "Handling Komponen",
                    desc: "Pegang komponen dari tepinya, hindari menyentuh pin atau chip secara langsung"
                },
                force: {
                    title: "Tidak Memaksa",
                    desc: "Jangan memaksakan komponen saat instalasi. Jika terasa keras, periksa kembali orientasinya"
                },
                professional: {
                    title: "Konsultasi Profesional",
                    desc: "Jika belum berpengalaman, pertimbangkan bantuan teknisi profesional"
                }
            },
            environment: {
                title: "Lingkungan Hidup (LH)",
                disposal: {
                    title: "Pembuangan Komponen Lama",
                    desc: "Buang komponen elektronik lama di tempat daur ulang e-waste yang terdaftar"
                },
                efficiency: {
                    title: "Efisiensi Energi",
                    desc: "Pilih PSU dengan sertifikasi 80+ untuk efisiensi daya lebih baik"
                },
                packaging: {
                    title: "Packaging",
                    desc: "Simpan kemasan original untuk keperluan RMA atau penjualan kembali"
                },
                power: {
                    title: "Hemat Listrik",
                    desc: "Aktifkan fitur power saving di BIOS dan OS untuk menghemat energi"
                }
            },
            tools: {
                title: "Alat yang Dibutuhkan",
                screwdriver: {
                    title: "Obeng Phillips (Bintang)",
                    desc: "Untuk mengencangkan sebagian besar sekrup di casing dan komponen"
                },
                flathead: {
                    title: "Obeng Flathead (Minus)",
                    desc: "Untuk beberapa sekrup tertentu dan pry tool"
                },
                wriststrap: {
                    title: "Gelang Anti-Statis",
                    desc: "Wajib untuk melindungi komponen dari ESD"
                },
                thermal: {
                    title: "Thermal Paste",
                    desc: "Untuk CPU cooler (kadang sudah pre-applied)"
                },
                cables: {
                    title: "Cable Ties/Velcro",
                    desc: "Untuk cable management yang rapi"
                },
                flashlight: {
                    title: "Senter/Lampu",
                    desc: "Membantu melihat di area gelap dalam casing"
                },
                manual: {
                    title: "Manual Motherboard",
                    desc: "Panduan penting untuk instalasi yang benar"
                }
            },
            general: {
                title: "Disclaimer Umum",
                intro: "Ini adalah simulator edukatif untuk pembelajaran. Informasi yang disediakan bersifat umum dan mungkin tidak mencerminkan kondisi pasar aktual.",
                notResponsible: "Kami TIDAK bertanggung jawab atas:",
                damage: "Kerusakan komponen akibat kesalahan instalasi atau penanganan",
                incompatibility: "Ketidakcocokan komponen yang tidak terdeteksi oleh sistem simulator",
                pricing: "Perbedaan harga aktual di toko dengan estimasi di simulator",
                performance: "Performa aktual yang mungkin berbeda dari estimasi benchmark",
                purchase: "Keputusan pembelian berdasarkan informasi dari simulator ini",
                data: "Kehilangan data atau kerusakan sistem akibat perakitan yang tidak tepat",
                recommendations: "Rekomendasi:",
                verify: "Selalu verifikasi kompatibilitas komponen dengan manual resmi",
                checkPrice: "Cek harga aktual di toko sebelum membeli",
                consult: "Konsultasi dengan teknisi profesional jika belum berpengalaman",
                review: "Baca review dan benchmark independen sebelum membeli",
                warranty: "Pastikan semua komponen memiliki garansi resmi",
                agreement: "Dengan menggunakan simulator ini, Anda menyetujui bahwa semua keputusan dan risiko adalah tanggung jawab Anda sendiri."
            }
        },
        
        // Contact Page (LENGKAP)
        contact: {
            title: "Hubungi Kami",
            subtitle: "Kami siap membantu Anda merakit PC impian",
            phone: "Telepon / WhatsApp",
            phoneNumber: "+62 851 7956 2922",
            phoneHours: "Senin - Sabtu, 09:00 - 18:00 WIB",
            email: "Email",
            emailAddress: "nedazafa@gmail.com",
            emailResponse: "Respon dalam 1x24 jam",
            address: "Alamat",
            addressLine1: "Jalan Pattimura No. 3, Kelurahan Sumbang,",
            addressLine2: "Bojonegoro, Jawa Timur",
            country: "Indonesia",
            instagram: "Instagram",
            instagramHandle: "@nedazafa_87",
            instagramDesc: "Follow untuk tips & update",
            form: {
                title: "Kotak Saran",
                desc: "Berikan saran, kritik, atau pertanyaan Anda kepada kami",
                name: "Nama Lengkap",
                namePlaceholder: "Masukkan nama Anda",
                email: "Email",
                emailPlaceholder: "nama@email.com",
                phone: "Nomor Telepon (Opsional)",
                phonePlaceholder: "+62 812-xxxx-xxxx",
                category: "Kategori",
                categoryPlaceholder: "Pilih Kategori",
                categoryOptions: {
                    suggestion: "Saran",
                    criticism: "Kritik",
                    question: "Pertanyaan",
                    bug: "Laporkan Bug",
                    other: "Lainnya"
                },
                message: "Pesan",
                messagePlaceholder: "Tulis pesan Anda di sini...",
                submit: "Kirim Pesan",
                success: "Terima kasih! Pesan Anda telah berhasil dikirim.",
                error: "Maaf, terjadi kesalahan. Silakan coba lagi."
            }
        },

        
        // Footer
        footer: {
            about: "Platform simulator perakitan PC terpercaya untuk membantu Anda merakit PC impian dengan mudah dan profesional.",
            quickLinks: "Quick Links",
            contact: "Kontak",
            copyright: "Dikembangkan oleh NeDazafa. Seluruh hak cipta dilindungi."
        },
        
        // Notifications
        notifications: {
            saved: "Build berhasil disimpan",
            deleted: "Build berhasil dihapus",
            exported: "Build berhasil di-export",
            copied: "Disalin ke clipboard",
            error: "Terjadi kesalahan",
            loading: "Memuat...",
            presetLoaded: "Preset dimuat",
            noComponents: "Tidak ada komponen yang dipilih",
            resetConfirm: "Apakah Anda yakin ingin mereset semua komponen?"
        },
        
        // Common
        common: {
            close: "Tutup",
            cancel: "Batal",
            confirm: "Konfirmasi",
            save: "Simpan",
            delete: "Hapus",
            export: "Export",
            load: "Muat",
            reset: "Reset",
            search: "Cari",
            yes: "Ya",
            no: "Tidak"
        }
    },
    
    en: {
        // Navbar
        nav: {
            brand: "NgoPi",
            home: "Home",
            build: "Build PC",
            recommend: "Recommendations",
            disclaimer: "Disclaimer",
            contact: "Contact"
        },
        
        // Home Page
        home: {
            hero: {
                title: "BUILD YOUR DREAM PC<br>EASILY AND PROFESSIONALLY",
                subtitle: "Build your PC easily, hassle-free, and professionally according to<br>your needs and budget.",
                cta: "Start Building PC"
            },
            features: {
                title: "Featured Functions",
                subtitle: "Everything you need to build the perfect PC",
                budget: {
                    title: "Budget Calculator",
                    desc: "Real-time price calculation with smart budget filters and cost optimization suggestions"
                },
                compatibility: {
                    title: "Compatibility Check",
                    desc: "Automatic detection of incompatible components with detailed solutions and recommendations"
                },
                performance: {
                    title: "Performance Analysis",
                    desc: "View estimated benchmarks and gaming performance at various resolutions"
                },
                save: {
                    title: "Save Configuration",
                    desc: "Save and manage various build configurations with export function"
                },
                compare: {
                    title: "Compare Builds",
                    desc: "Compare various builds side by side to find the best configuration"
                },
                smart: {
                    title: "Smart Recommendations",
                    desc: "Pre-configured build suggestions for various needs and budgets"
                }
            },
            cta: {
                title: "Ready to Build?",
                subtitle: "Start configuring your dream PC with our professional tools",
                button: "Start Now"
            }
        },
        
        // Build Page
        build: {
            sidebar: {
                budget: "Budget Calculator",
                budgetMin: "Minimum Budget",
                budgetMax: "Maximum Budget",
                summary: "Build Summary",
                totalPrice: "Total Price",
                savedBuilds: "Saved Builds"
            },
            actions: {
                analysis: "Performance Analysis",
                save: "Save Build",
                print: "Print Summary",
                reset: "Reset All"
            },
            components: {
                cpu: "Processor (CPU)",
                mb: "Motherboard",
                ram: "Memory (RAM)",
                vga: "Graphics Card (GPU)",
                storage: "Storage (SSD)",
                psu: "Power Supply (PSU)",
                case: "Case",
                cooling: "Cooling System",
                os: "Operating System",
                selectPlaceholder: "Select"
            },
            compatibility: {
                critical: "Critical Issues",
                warning: "Warnings",
                success: "All Systems Compatible",
                noIssues: "No compatibility issues detected. Your build is ready to assemble."
            },
            budget: {
                exceeded: "Budget Exceeded",
                excess: "Excess",
                nearLimit: "Near Budget Limit",
                remaining: "Remaining",
                withinBudget: "Within Budget"
            },
            modal: {
                performance: "Performance Analysis",
                subtitle: "Estimated benchmarks based on selected components",
                gaming: "Gaming Performance",
                usecase: "Performance by Use Case",
                overall: "Overall System Rating",
                benchmarks: "Video Benchmark References",
                note: "Benchmark scores are estimates and may vary depending on system configuration, drivers, and usage conditions."
            },
            empty: {
                title: "No saved builds yet",
                subtitle: "Start building and save your configurations"
            }
        },
        
        // Recommendation Page
        recommend: {
            title: "PC Build Recommendations",
            subtitle: "Ready-to-use configurations for various needs and budgets",
            presets: {
                office: {
                    title: "Office Productivity",
                    badge: "Business"
                },
                school: {
                    title: "School / Learning PC",
                    badge: "Education"
                },
                budget: {
                    title: "Entry Level Gaming",
                    badge: "Budget"
                },
                gaming: {
                    title: "High Performance Gaming",
                    badge: "Gaming"
                },
                editing: {
                    title: "Content Creation",
                    badge: "Professional"
                },
                server: {
                    title: "Server / Workstation",
                    badge: "Workstation"
                }
            },
            guide: {
                title: "PC Components Guide",
                subtitle: "Understanding the function of each component in your PC system",
                cpu: {
                    title: "Processor (CPU)",
                    desc: "The brain of the computer that processes all instructions. A faster CPU results in more responsive system performance."
                },
                mb: {
                    title: "Motherboard",
                    desc: "The main circuit board that connects all components. Must be compatible with the selected CPU socket."
                },
                ram: {
                    title: "Memory (RAM)",
                    desc: "Temporary storage for data being processed. More RAM allows for smoother multitasking."
                },
                vga: {
                    title: "Graphics Card (GPU)",
                    desc: "Processes graphics and visuals. Very important for gaming and high-quality video rendering."
                },
                storage: {
                    title: "Storage (SSD)",
                    desc: "Stores operating system, programs, and files. SSDs are much faster than traditional HDDs."
                },
                psu: {
                    title: "Power Supply (PSU)",
                    desc: "Supplies power to all components. Adequate wattage and high efficiency are very important."
                }
            },
            button: "Load Configuration"
        },
        
        // Disclaimer Page
       // Disclaimer Page (LENGKAP)
        disclaimer: {
            title: "Disclaimer, Safety & Assembly Guide",
            subtitle: "Important information before building your PC",
            assembly: {
                title: "PC Assembly Procedure",
                step1: {
                    title: "Preparation",
                    desc: "Prepare all components, tools, and manuals. Wear anti-static wrist strap and ensure clean workspace."
                },
                step2: {
                    title: "Install CPU to Motherboard",
                    desc: "Open CPU socket, align marking/triangle, carefully place CPU, and lock socket."
                },
                step3: {
                    title: "Install CPU Cooler",
                    desc: "Apply thermal paste (if needed), install cooler according to guide, and connect fan cable to motherboard."
                },
                step4: {
                    title: "Install RAM",
                    desc: "Open RAM slot clips, align notch on RAM with slot, press until clips lock automatically."
                },
                step5: {
                    title: "Install I/O Shield & Motherboard",
                    desc: "Install I/O shield in case, place motherboard, align with standoffs, tighten screws."
                },
                step6: {
                    title: "Install Storage (SSD/HDD)",
                    desc: "For M.2 SSD: insert into M.2 slot at 30° angle, press and tighten screw. For SATA: connect data and power cables."
                },
                step7: {
                    title: "Install Graphics Card",
                    desc: "Remove slot cover from case, align GPU with PCIe x16 slot, press until click, secure bracket."
                },
                step8: {
                    title: "Install Power Supply",
                    desc: "Place PSU in bracket (fan facing out/down), tighten screws, connect modular cables if available."
                },
                step9: {
                    title: "Cable Management",
                    desc: "Connect cables: 24-pin ATX, 8-pin CPU, PCIe for GPU, SATA, front panel connectors. Organize with cable ties."
                },
                step10: {
                    title: "Final Check & Power On",
                    desc: "Recheck all connections, install side panel, connect monitor, keyboard, mouse. Power on and enter BIOS for verification."
                }
            },
            considerations: {
                title: "Important Considerations",
                socket: {
                    title: "Socket Compatibility",
                    desc: "Intel CPUs require Intel motherboards (LGA1700), AMD CPUs require AMD motherboards (AM5)"
                },
                psu: {
                    title: "PSU Capacity",
                    desc: "Calculate total power consumption (TDP) of all components, add 20-30% margin for safety"
                },
                ram: {
                    title: "RAM Type",
                    desc: "Intel Gen 13/14 and AMD Ryzen 7000 platforms support DDR5. Older platforms use DDR4"
                },
                case: {
                    title: "Case Size",
                    desc: "Ensure GPU length and CPU cooler height fit inside the case"
                },
                cooling: {
                    title: "Cooling",
                    desc: "Case with good airflow and adequate CPU cooler are important for stability"
                },
                warranty: {
                    title: "Warranty",
                    desc: "Keep receipts and packaging for warranty claims (usually 1-3 years)"
                },
                bios: {
                    title: "BIOS Update",
                    desc: "Some motherboards may need BIOS update for latest CPUs"
                }
            },
            safety: {
                title: "Occupational Safety & Health",
                workspace: {
                    title: "Workspace",
                    desc: "Ensure workspace is clean, dry, with adequate lighting and good ventilation"
                },
                antistatic: {
                    title: "Anti-Static",
                    desc: "Use anti-static wrist strap (ESD wrist strap) to protect components from electrostatic damage"
                },
                electricity: {
                    title: "Electricity",
                    desc: "Always turn off and unplug power cable before starting assembly"
                },
                handling: {
                    title: "Component Handling",
                    desc: "Hold components by edges, avoid touching pins or chips directly"
                },
                force: {
                    title: "Don't Force",
                    desc: "Don't force components during installation. If it feels hard, recheck orientation"
                },
                professional: {
                    title: "Professional Consultation",
                    desc: "If inexperienced, consider professional technician assistance"
                }
            },
            environment: {
                title: "Environmental Health",
                disposal: {
                    title: "Old Component Disposal",
                    desc: "Dispose of old electronic components at registered e-waste recycling facilities"
                },
                efficiency: {
                    title: "Energy Efficiency",
                    desc: "Choose PSU with 80+ certification for better power efficiency"
                },
                packaging: {
                    title: "Packaging",
                    desc: "Keep original packaging for RMA purposes or resale"
                },
                power: {
                    title: "Power Saving",
                    desc: "Enable power saving features in BIOS and OS to conserve energy"
                }
            },
            tools: {
                title: "Required Tools",
                screwdriver: {
                    title: "Phillips Screwdriver",
                    desc: "For tightening most screws in case and components"
                },
                flathead: {
                    title: "Flathead Screwdriver",
                    desc: "For certain screws and pry tool"
                },
                wriststrap: {
                    title: "Anti-Static Wrist Strap",
                    desc: "Mandatory to protect components from ESD"
                },
                thermal: {
                    title: "Thermal Paste",
                    desc: "For CPU cooler (sometimes pre-applied)"
                },
                cables: {
                    title: "Cable Ties/Velcro",
                    desc: "For neat cable management"
                },
                flashlight: {
                    title: "Flashlight/Light",
                    desc: "Helps see in dark areas inside case"
                },
                manual: {
                    title: "Motherboard Manual",
                    desc: "Important guide for correct installation"
                }
            },
            general: {
                title: "General Disclaimer",
                intro: "This is an educational simulator for learning. Information provided is general and may not reflect actual market conditions.",
                notResponsible: "We are NOT responsible for:",
                damage: "Component damage due to installation errors or handling",
                incompatibility: "Component incompatibility not detected by simulator system",
                pricing: "Actual price differences at stores from simulator estimates",
                performance: "Actual performance that may differ from benchmark estimates",
                purchase: "Purchase decisions based on information from this simulator",
                data: "Data loss or system damage due to improper assembly",
                recommendations: "Recommendations:",
                verify: "Always verify component compatibility with official manuals",
                checkPrice: "Check actual prices at stores before buying",
                consult: "Consult with professional technician if inexperienced",
                review: "Read independent reviews and benchmarks before buying",
                warranty: "Ensure all components have official warranty",
                agreement: "By using this simulator, you agree that all decisions and risks are your own responsibility."
            }
        },
        
        // Contact Page (LENGKAP)
        contact: {
            title: "Contact Us",
            subtitle: "We're ready to help you build your dream PC",
            phone: "Phone / WhatsApp",
            phoneNumber: "+62 851 7956 2922",
            phoneHours: "Monday - Saturday, 09:00 - 18:00 WIB",
            email: "Email",
            emailAddress: "nedazafa@gmail.com",
            emailResponse: "Response within 24 hours",
            address: "Address",
            addressLine1: "Jalan Pattimura No. 3, Kelurahan Sumbang,",
            addressLine2: "Bojonegoro, East Java",
            country: "Indonesia",
            instagram: "Instagram",
            instagramHandle: "@nedazafa_87",
            instagramDesc: "Follow for tips & updates",
            form: {
                title: "Suggestion Box",
                desc: "Share your suggestions, criticisms, or questions with us",
                name: "Full Name",
                namePlaceholder: "Enter your name",
                email: "Email",
                emailPlaceholder: "name@email.com",
                phone: "Phone Number (Optional)",
                phonePlaceholder: "+62 812-xxxx-xxxx",
                category: "Category",
                categoryPlaceholder: "Select Category",
                categoryOptions: {
                    suggestion: "Suggestion",
                    criticism: "Criticism",
                    question: "Question",
                    bug: "Report Bug",
                    other: "Other"
                },
                message: "Message",
                messagePlaceholder: "Write your message here...",
                submit: "Send Message",
                success: "Thank you! Your message has been successfully sent.",
                error: "Sorry, an error occurred. Please try again."
            }
        },
        
        // Footer
        footer: {
            about: "Trusted PC building simulator platform to help you build your dream PC easily and professionally.",
            quickLinks: "Quick Links",
            contact: "Contact",
            copyright: "Developed by NeDazafa. All rights reserved."
        },
        
        // Notifications
        notifications: {
            saved: "Build successfully saved",
            deleted: "Build successfully deleted",
            exported: "Build successfully exported",
            copied: "Copied to clipboard",
            error: "An error occurred",
            loading: "Loading...",
            presetLoaded: "Preset loaded",
            noComponents: "No components selected",
            resetConfirm: "Are you sure you want to reset all components?"
        },
        
        // Common
        common: {
            close: "Close",
            cancel: "Cancel",
            confirm: "Confirm",
            save: "Save",
            delete: "Delete",
            export: "Export",
            load: "Load",
            reset: "Reset",
            search: "Search",
            yes: "Yes",
            no: "No"
        }
    }
};

// Export translations
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
}

console.log('translations.js loaded successfully');
console.log('Available languages:', Object.keys(translations));