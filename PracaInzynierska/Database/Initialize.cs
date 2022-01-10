using API.Enums;
using API.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace API.Database
{
    public class Initialize
    {
        private static readonly string IMAGE_PATH = "Database\\Images\\";

        public static async Task Init(DatabaseContext db, UserManager<User> userManager, RoleManager<UserRole> roleManager)
        {
            db.Database.EnsureCreated();
            await UsersInit(userManager, roleManager);
            CitiesInit(db);
            MonumentsAndTripsInit(db);
            //BannedWordsInit(db);

            var mo = db.Monuments.FirstOrDefault(m => m.Name == "Wielka Krokiew");
            mo.IsVerified = false;
            db.SaveChanges();

        }


        private static async Task UsersInit(UserManager<User> userManager, RoleManager<UserRole> roleManager)
        {
            string role1 = "User", role2 = "Admin", password = "admin";
            string usersPassword = "aaaaa";

            if (await roleManager.FindByNameAsync(role1) == null)
            {
                await roleManager.CreateAsync(new UserRole(role1));
            }

            if (await roleManager.FindByNameAsync(role2) == null)
            {
                await roleManager.CreateAsync(new UserRole(role2));
            }

            if (await userManager.FindByNameAsync("admin") == null)
            {
                var admin = new User()
                {
                    UserName = "admin",
                    Email = "admin@admin.ru"
                };

                var result = await userManager.CreateAsync(admin);
                if (result.Succeeded)
                {
                    await userManager.AddPasswordAsync(admin, password);
                    await userManager.AddToRoleAsync(admin, role2);
                }



                #region Users
                var user1 = new User()
                {
                    UserName = "Bartek",
                    Email = "bartek@ba.rtek"
                };
                var result1 = await userManager.CreateAsync(user1);
                if (result1.Succeeded)
                {
                    await userManager.AddPasswordAsync(user1, usersPassword);
                    await userManager.AddToRoleAsync(user1, role1);
                }

                var user2 = new User()
                {
                    UserName = "Maciek",
                    Email = "maciek@ma.ciek"
                };
                var result2 = await userManager.CreateAsync(user2);
                if (result2.Succeeded)
                {
                    await userManager.AddPasswordAsync(user2, usersPassword);
                    await userManager.AddToRoleAsync(user2, role1);
                }

                var user3 = new User()
                {
                    UserName = "Janusz",
                    Email = "janusz@ja.nusz"
                };
                var result3 = await userManager.CreateAsync(user3);
                if (result3.Succeeded)
                {
                    await userManager.AddPasswordAsync(user3, usersPassword);
                    await userManager.AddToRoleAsync(user3, role1);
                }

                var user4 = new User()
                {
                    UserName = "Pazdan",
                    Email = "pazdan@pa.zdan"
                };
                var result4 = await userManager.CreateAsync(user4);
                if (result4.Succeeded)
                {
                    await userManager.AddPasswordAsync(user4, usersPassword);
                    await userManager.AddToRoleAsync(user4, role1);
                }

                var user5 = new User()
                {
                    UserName = "Hajto",
                    Email = "tomasz@haj.to"
                };
                var result5 = await userManager.CreateAsync(user5);
                if (result5.Succeeded)
                {
                    await userManager.AddPasswordAsync(user5, usersPassword);
                    await userManager.AddToRoleAsync(user5, role1);
                }

                #endregion

            }
        }

        private static void BannedWordsInit(DatabaseContext db)
        {
            if(db.BannedWords.Count() == 0)
            {
                db.BannedWords.Add(new BannedWord()
                {
                    Word = "pajac"
                });

                db.BannedWords.Add(new BannedWord()
                {
                    Word = "baran"
                });

                db.BannedWords.Add(new BannedWord()
                {
                    Word = "plebs"
                });

                db.BannedWords.Add(new BannedWord()
                {
                    Word = "xd"
                });

                db.BannedWords.Add(new BannedWord()
                {
                    Word = "klops"
                });

                db.BannedWords.Add(new BannedWord()
                {
                    Word = "baran"
                });

                db.BannedWords.Add(new BannedWord()
                {
                    Word = "kapitan bomba"
                });

                db.BannedWords.Add(new BannedWord()
                {
                    Word = "kopytko"
                });

                db.BannedWords.Add(new BannedWord()
                {
                    Word = "kurde bele"
                });

                db.BannedWords.Add(new BannedWord()
                {
                    Word = "fikumiku"
                });

                db.SaveChanges();
            }
        }

        private static void CitiesInit(DatabaseContext db)
        {
            if (!db.Cities.Any(c => c.Name == "Białystok"))
            {
                db.Cities.Add(new City()
                {
                    Name = "Białystok"
                });
            }

            if (!db.Cities.Any(c => c.Name == "Warszawa"))
            {
                db.Cities.Add(new City()
                {
                    Name = "Warszawa"
                });
            }

            if (!db.Cities.Any(c => c.Name == "Supraśl"))
            {
                db.Cities.Add(new City()
                {
                    Name = "Supraśl"
                });
            }

            if (!db.Cities.Any(c => c.Name == "Kraków"))
            {
                db.Cities.Add(new City()
                {
                    Name = "Kraków"
                });
            }

            if (!db.Cities.Any(c => c.Name == "Poznań"))
            {
                db.Cities.Add(new City()
                {
                    Name = "Poznań"
                });
            }

            if (!db.Cities.Any(c => c.Name == "Łódź"))
            {
                db.Cities.Add(new City()
                {
                    Name = "Łódź"
                });
            }

            if (!db.Cities.Any(c => c.Name == "Szczecin"))
            {
                db.Cities.Add(new City()
                {
                    Name = "Szczecin"
                });
            }

            if (!db.Cities.Any(c => c.Name == "Gdańsk"))
            {
                db.Cities.Add(new City()
                {
                    Name = "Gdańsk"
                });
            }

            if (!db.Cities.Any(c => c.Name == "Toruń"))
            {
                db.Cities.Add(new City()
                {
                    Name = "Toruń"
                });
            }

            if (!db.Cities.Any(c => c.Name == "Zakopane"))
            {
                db.Cities.Add(new City()
                {
                    Name = "Zakopane"
                });
            }

            if (!db.Cities.Any(c => c.Name == "Radom"))
            {
                db.Cities.Add(new City()
                {
                    Name = "Radom"
                });
            }

            if (!db.Cities.Any(c => c.Name == "Wrocław"))
            {
                db.Cities.Add(new City()
                {
                    Name = "Wrocław"
                });
            }

            db.SaveChanges();
        }

        private static void MonumentsAndTripsInit(DatabaseContext db)
        {
            if (db.Monuments.Count() == 0)
            {
                byte[] mainPhoto;
                List<NewPhoto> newPhotos = new List<NewPhoto>();
                List<OldPhoto> oldPhotos = new List<OldPhoto>();

                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "palacbranickich.jpg", FileMode.Open)))
                {
                    mainPhoto = br.ReadBytes((int)br.BaseStream.Length);
                }

                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "palacbranickich_new1.jpg", FileMode.Open)))
                {
                    newPhotos.Add(new NewPhoto()
                    {
                        Picture = br.ReadBytes((int)br.BaseStream.Length),
                        Source = "https://pl.wikipedia.org/wiki/Pa%C5%82ac_Branickich_w_Bia%C5%82ymstoku",
                    });
                }

                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "palacbranickich_new2.jpg", FileMode.Open)))
                {
                    newPhotos.Add(new NewPhoto()
                    {
                        Picture = br.ReadBytes((int)br.BaseStream.Length),
                        Source = "https://pl.wikipedia.org/wiki/Pa%C5%82ac_Branickich_w_Bia%C5%82ymstoku",
                    });
                }

                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "palacbranickich_new3.jpg", FileMode.Open)))
                {
                    newPhotos.Add(new NewPhoto()
                    {
                        Picture = br.ReadBytes((int)br.BaseStream.Length),
                        Source = "https://pl.wikipedia.org/wiki/Pa%C5%82ac_Branickich_w_Bia%C5%82ymstoku",
                    });
                }

                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "palacbranickich_new4.jpg", FileMode.Open)))
                {
                    newPhotos.Add(new NewPhoto()
                    {
                        Picture = br.ReadBytes((int)br.BaseStream.Length),
                        Source = "https://pl.wikipedia.org/wiki/Pa%C5%82ac_Branickich_w_Bia%C5%82ymstoku",
                    });
                }

                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "palacbranickich_new5.jpg", FileMode.Open)))
                {
                    newPhotos.Add(new NewPhoto()
                    {
                        Picture = br.ReadBytes((int)br.BaseStream.Length),
                        Source = "https://pl.wikipedia.org/wiki/Pa%C5%82ac_Branickich_w_Bia%C5%82ymstoku",
                    });
                }

                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "palacbranickich_old1.jpg", FileMode.Open)))
                {
                    oldPhotos.Add(new OldPhoto()
                    {
                        Picture = br.ReadBytes((int)br.BaseStream.Length),
                        Source = "google.com",
                        Date = 1930
                    });
                }

                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "palacbranickich_old2.jpg", FileMode.Open)))
                {
                    oldPhotos.Add(new OldPhoto()
                    {
                        Picture = br.ReadBytes((int)br.BaseStream.Length),
                        Source = "google.com",
                        Date = 1969
                    });
                }

                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "palacbranickich_old3.jpg", FileMode.Open)))
                {
                    oldPhotos.Add(new OldPhoto()
                    {
                        Picture = br.ReadBytes((int)br.BaseStream.Length),
                        Source = "google.com",
                        Date = 1972
                    });
                }

                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "palacbranickich_old4.jpg", FileMode.Open)))
                {
                    oldPhotos.Add(new OldPhoto()
                    {
                        Picture = br.ReadBytes((int)br.BaseStream.Length),
                        Source = "google.com",
                        Date = 1949
                    });
                }

                var bialystokId = db.Cities.FirstOrDefault(c => c.Name == "Białystok").Id;
                var supraslId = db.Cities.FirstOrDefault(c => c.Name == "Supraśl").Id;
                var warszawaId = db.Cities.FirstOrDefault(c => c.Name == "Warszawa").Id;
                var lodzId = db.Cities.FirstOrDefault(c => c.Name == "Łódź").Id;
                var gdanskId = db.Cities.FirstOrDefault(c => c.Name == "Gdańsk").Id;
                var krakowId = db.Cities.FirstOrDefault(c => c.Name == "Kraków").Id;
                var poznanId = db.Cities.FirstOrDefault(c => c.Name == "Poznań").Id;
                var zakopaneId = db.Cities.FirstOrDefault(c => c.Name == "Zakopane").Id;
                var torunId = db.Cities.FirstOrDefault(c => c.Name == "Toruń").Id;
                var szczecinId = db.Cities.FirstOrDefault(c => c.Name == "Szczecin").Id;
                var radomId = db.Cities.FirstOrDefault(c => c.Name == "Radom").Id;
                var wroclawId = db.Cities.FirstOrDefault(c => c.Name == "Wrocław").Id;


                var adminId = db.Users.FirstOrDefault(u => u.UserName == "admin").Id;
                var hajtoId = db.Users.FirstOrDefault(u => u.UserName == "Hajto").Id;
                var pazdanId = db.Users.FirstOrDefault(u => u.UserName == "Pazdan").Id;

                var marks_m1 = new List<Mark>()
                {
                    new Mark()
                    {
                        Comment = "Codziennie przechodzę obok tak cudownej pod względem architektonicznym budowli i nie mogę się nacieszyć. Polecam Tomasz Hajto.",
                        CreationDate = new DateTime(2019, 10, 10, 22, 22, 23),
                        Grade = 5,
                        UserId = hajtoId
                    },

                    new Mark()
                    {
                        Comment = "Muszę przyznać, że jest to jedna z najlepszych atrakcji w Białymstoku. Wiele razy zwiedzałem ją jeszcze, gdy grałem dla Jagiellonii Białystok, ale ani razu mi się nie znudziła. Budowla przepiękna, aż chce mi się tu wracać za każdym razem.",
                        CreationDate = new DateTime(2019, 10, 7, 11, 29, 1),
                        Grade = 5,
                        UserId = pazdanId
                    },

                    new Mark()
                    {
                        Comment = "",
                        CreationDate = new DateTime(2019, 11, 1, 23, 29, 45),
                        Grade = 4,
                        UserId = adminId
                    }
                };

                var titbits_m1 = new List<Titbit>()
                {
                    new Titbit()
                    {
                        CreatorId = hajtoId,
                        Description = "Jeszcze gdy chodziłem do podstawówki to był tam taki Paweł i ja jechałem na rowerze i go spotkałem i potem jeszcze pojechałem do Biedronki na lody i po drodze do domu wtedy jeszcze, już do domu pojechałem.",
                        Name = "Taki Paweł"
                    },

                    new Titbit()
                    {
                        CreatorId = hajtoId,
                        Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                        Name = "L o r e m i p s u m"
                    },

                    new Titbit()
                    {
                        CreatorId = adminId,
                        Description = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
                        Name = "Najstarszy pałac"
                    },

                    new Titbit()
                    {
                        CreatorId = pazdanId,
                        Description = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
                        Name = "Najwyższy pałac"
                    }
                };

                var monument1 = new Monument()
                {
                    Address = "Jana Kilińskiego 1",
                    AverageMark = 4.33M,
                    CityId = bialystokId,
                    CreationDate = "1697 r.",
                    CreatorId = adminId,
                    Description  = "Zabytkowy pałac w Białymstoku, jedna z najlepiej zachowanych rezydencji magnackich epoki saskiej na ziemiach dawnej Rzeczypospolitej w stylu późnobarokowym określany mianem „Wersalu Podlasia”, „Wersalem Północy”, a także „Polskim Wersalem”. Początki pałacu sięgają XVI wieku. Murowany zamek w stylu gotycko-renesansowym został zbudowany przez królewskiego architekta Hioba Bretfusa, znanego z budowy Zamku Dolnego w Wilnie, dworu królewskiego w Knyszynie, oraz modernizacji i rozbudowy Starego Zamku w Kamieńcu Podolskim czy zamku w Tykocinie. Kompletnie przebudowany w stylu późnobarokowym przez trzech architektów: Tylmana z Gameren, Jana Zygmunta Deybela i Jakuba Fontanę. Pałac został zniszczony w 1944, odbudowany w latach 1946–1960. Od końca II wojny światowej mieściła się w nim Akademia Medyczna, obecnie Uniwersytet Medyczny w Białymstoku.",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 53.130500064145934M,
                    Longitude = 23.164844512939457M,
                    MainPhoto = mainPhoto,
                    MonumentType = MonumentType.Pałac,
                    Name = "Pałac Branickich",
                    Marks = marks_m1,
                    Titbits = titbits_m1,
                    NewPhotos = newPhotos,
                    OldPhotos = oldPhotos,
                };

                byte[] mainPhoto2;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "rocha.jpg", FileMode.Open)))
                {
                    mainPhoto2 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument2 = new Monument()
                {
                    Address = "Księdza Adama Abramowicza 1",
                    AverageMark = 3.0M,
                    CityId = bialystokId,
                    CreationDate = "1839 r.",
                    CreatorId = adminId,
                    Description = "Kościół rzymskokatolicki ufundowany jako Pomnik Odzyskania Niepodległości, znajdujący się na wzgórzu św. Rocha w Białymstoku, na miejscu kaplicy św. Rocha i katolickiego cmentarza z 1839 r.",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 53.134568208542255M,
                    Longitude = 23.144931793212894M,
                    MainPhoto = mainPhoto2,
                    MonumentType = MonumentType.Kościół,
                    Name = "Kościół św. Rocha",
                };

                byte[] mainPhoto3;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "muzeumpodlaskie.jpg", FileMode.Open)))
                {
                    mainPhoto3 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument3 = new Monument()
                {
                    Address = "Rynek Kościuszki 10",
                    AverageMark = 1.0M,
                    CityId = bialystokId,
                    CreationDate = "1855 r.",
                    CreatorId = adminId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 53.132328202001325M,
                    Longitude = 23.158718347549442M,
                    MainPhoto = mainPhoto3,
                    MonumentType = MonumentType.Muzeum,
                    Name = "Muzeum Podlaskie w Białymstoku",
                };

                byte[] mainPhoto4;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "rynekkosciuszki.jpg", FileMode.Open)))
                {
                    mainPhoto4 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument4 = new Monument()
                {
                    Address = "Rynek Kościuszki",
                    AverageMark = 0M,
                    CityId = bialystokId,
                    CreationDate = "XVI wiek",
                    CreatorId = adminId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 53.132276706224935M,
                    Longitude = 23.16048860549927M,
                    MainPhoto = mainPhoto4,
                    MonumentType = MonumentType.Rynek,
                    Name = "Rynek Kościuszki",
                };

                byte[] mainPhoto5;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "pomnikjpilsudskiego.jpg", FileMode.Open)))
                {
                    mainPhoto5 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument5 = new Monument()
                {
                    Address = "Rynek Kościuszki 4",
                    AverageMark = 0M,
                    CityId = bialystokId,
                    CreationDate = "XX wiek",
                    CreatorId = adminId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 53.132386134676004M,
                    Longitude = 23.1617546081543M,
                    MainPhoto = mainPhoto5,
                    MonumentType = MonumentType.Pomnik,
                    Name = "Pomnik Marszałka Józefa Piłsudskiego",
                };


                byte[] mainPhoto6;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "boiskopieczurki.jpg", FileMode.Open)))
                {
                    mainPhoto6 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument6 = new Monument()
                {
                    Address = "Pieczarkowa 6",
                    AverageMark = 0M,
                    CityId = bialystokId,
                    CreationDate = "XXI wiek",
                    CreatorId = adminId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = false,
                    Latitude = 53.135829770013686M,
                    Longitude = 23.21891784667969M,
                    MainPhoto = mainPhoto6,
                    MonumentType = MonumentType.Inny,
                    Name = "Pieczurki Stadium",
                };


                byte[] mainPhoto7;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "planty.jpg", FileMode.Open)))
                {
                    mainPhoto7 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument7 = new Monument()
                {
                    Address = "Akademicka 16",
                    AverageMark = 0M,
                    CityId = bialystokId,
                    CreationDate = "XIX wiek",
                    CreatorId = adminId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = false,
                    Latitude = 53.126483037357566M,
                    Longitude = 23.166319727897648M,
                    MainPhoto = mainPhoto7,
                    MonumentType = MonumentType.Park,
                    Name = "Park Planty w Białymstoku",
                };


                byte[] mainPhoto8;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "muzeumikon.jpg", FileMode.Open)))
                {
                    mainPhoto8 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument8 =  new Monument()
                {
                    Address = "Supraślańska 116",
                    AverageMark = 0M,
                    CityId = supraslId,
                    CreationDate = "1966 rok",
                    CreatorId = pazdanId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 53.21112479172618M,
                    Longitude = 23.33793550729752M,
                    MainPhoto = mainPhoto8,
                    MonumentType = MonumentType.Muzeum,
                    Name = "Muzeum Ikon w Supraślu",
                };


                byte[] mainPhoto9;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "stadionsuprasl.jpg", FileMode.Open)))
                {
                    mainPhoto9 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument9 = new Monument()
                {
                    Address = "Przykładowa 33",
                    AverageMark = 0M,
                    CityId = supraslId,
                    CreationDate = "1991 rok",
                    CreatorId = pazdanId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 53.20779321787955M,
                    Longitude = 23.34030389785767M,
                    MainPhoto = mainPhoto9,
                    MonumentType = MonumentType.Inny,
                    Name = "Biedronka Stadium w Supraślu",
                };


                byte[] mainPhoto10;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "palackulturyinauki.jpg", FileMode.Open)))
                {
                    mainPhoto10 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument10 = new Monument()
                {
                    Address = "Plac Defilad 1",
                    AverageMark = 0M,
                    CityId = warszawaId,
                    CreationDate = "21 lipca 1955",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 52.231755385152574M,
                    Longitude = 21.006481647491455M,
                    MainPhoto = mainPhoto10,
                    MonumentType = MonumentType.Pałac,
                    Name = "Pałac Kultury i Nauki",
                };

                byte[] mainPhoto11;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "bulwarpattona.jpg", FileMode.Open)))
                {
                    mainPhoto11 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument11 = new Monument()
                {
                    Address = "Wybrzeże Kościuszkowskie 22",
                    AverageMark = 0M,
                    CityId = warszawaId,
                    CreationDate = "XX wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 52.246813745286374M,
                    Longitude = 21.021544933319095M,
                    MainPhoto = mainPhoto11,
                    MonumentType = MonumentType.Inny,
                    Name = "Bulwar gen. George'a Smitha Pattona",
                };

                byte[] mainPhoto12;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "skwersamuela.jpg", FileMode.Open)))
                {
                    mainPhoto12 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument12 = new Monument()
                {
                    Address = "Przykładowa 22",
                    AverageMark = 0M,
                    CityId = warszawaId,
                    CreationDate = "XVI wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 52.245526231893045M,
                    Longitude = 21.016588211059574M,
                    MainPhoto = mainPhoto12,
                    MonumentType = MonumentType.Park,
                    Name = "Skwer Samuela Orgelbranda",
                };

                byte[] mainPhoto13;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "parkpraski.jpg", FileMode.Open)))
                {
                    mainPhoto13 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument13 = new Monument()
                {
                    Address = "Aleja Solidarności",
                    AverageMark = 0M,
                    CityId = warszawaId,
                    CreationDate = "nie wiadomo",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 52.25315880118569M,
                    Longitude = 21.02667331695557M,
                    MainPhoto = mainPhoto13,
                    MonumentType = MonumentType.Park,
                    Name = "Park Praski w Warszawie",
                };

                byte[] mainPhoto14;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "stadionnarodowy.jpg", FileMode.Open)))
                {
                    mainPhoto14 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument14 = new Monument()
                {
                    Address = "Księcia Józefa Poniatowskiego 1",
                    AverageMark = 0M,
                    CityId = warszawaId,
                    CreationDate = "2012 rok",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 52.23957428141258M,
                    Longitude = 21.0454273223877M,
                    MainPhoto = mainPhoto14,
                    MonumentType = MonumentType.Inny,
                    Name = "Stadion Narodowy",
                };

                byte[] mainPhoto15;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "filtrylindleya.jpg", FileMode.Open)))
                {
                    mainPhoto15 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument15 = new Monument()
                {
                    Address = "Koszykowa 81",
                    AverageMark = 0M,
                    CityId = warszawaId,
                    CreationDate = "1934 rok",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 52.22112210483306M,
                    Longitude = 20.99418640136719M,
                    MainPhoto = mainPhoto15,
                    MonumentType = MonumentType.Inny,
                    Name = "Filtry Lindleya",
                };

                byte[] mainPhoto16;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "zamekkrolewskiwwarszawie.jpg", FileMode.Open)))
                {
                    mainPhoto16 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument16 = new Monument()
                {
                    Address = "Plac Zamkowy 4",
                    AverageMark = 0M,
                    CityId = warszawaId,
                    CreationDate = "1711 rok",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 52.247730090478726M,
                    Longitude = 21.014834046363834M,
                    MainPhoto = mainPhoto16,
                    MonumentType = MonumentType.Zamek,
                    Name = "Zamek Królewski w Warszawie",
                };

                byte[] mainPhoto17;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "pomnikmartyrologiidzieci.jpg", FileMode.Open)))
                {
                    mainPhoto17 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument17 = new Monument()
                {
                    Address = "Księdza Stanisława Staszica",
                    AverageMark = 0M,
                    CityId = lodzId,
                    CreationDate = "1993 rok",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 51.79241274963496M,
                    Longitude = 19.471721649169925M,
                    MainPhoto = mainPhoto17,
                    MonumentType = MonumentType.Pomnik,
                    Name = "Pomnik Martyrologii Dzieci",
                };

                byte[] mainPhoto18;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "parkszarychszeregow.jpg", FileMode.Open)))
                {
                    mainPhoto18 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument18 = new Monument()
                {
                    Address = "Tadeusza Boya-Żeleńskiego 1",
                    AverageMark = 0M,
                    CityId = lodzId,
                    CreationDate = "I wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 51.79184205701332M,
                    Longitude = 19.469554424285892M,
                    MainPhoto = mainPhoto18,
                    MonumentType = MonumentType.Park,
                    Name = "Park im. Szarych Szeregów",
                };

                byte[] mainPhoto19;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "parkponiatowskiego.jpg", FileMode.Open)))
                {
                    mainPhoto19 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument19 = new Monument()
                {
                    Address = "Aleja Adama Mickiewicza",
                    AverageMark = 0M,
                    CityId = lodzId,
                    CreationDate = "I wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 51.753815013860255M,
                    Longitude = 19.442710876464847M,
                    MainPhoto = mainPhoto19,
                    MonumentType = MonumentType.Park,
                    Name = "Park Poniatowskiego",
                };

                byte[] mainPhoto20;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "parkponiatowskiego.jpg", FileMode.Open)))
                {
                    mainPhoto20 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument20 = new Monument()
                {
                    Address = "Brzeźnieńska 9",
                    AverageMark = 0M,
                    CityId = gdanskId,
                    CreationDate = "XVIII wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 54.410988587683875M,
                    Longitude = 18.63143920898438M,
                    MainPhoto = mainPhoto20,
                    MonumentType = MonumentType.Inny,
                    Name = "Latarnia Morska",
                };

                byte[] mainPhoto21;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "parkwesterplatte.jpg", FileMode.Open)))
                {
                    mainPhoto21 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument21 = new Monument()
                {
                    Address = "Majora Henryka Sucharskiego",
                    AverageMark = 0M,
                    CityId = gdanskId,
                    CreationDate = "XX wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 54.406580207648986M,
                    Longitude = 18.675856590271M,
                    MainPhoto = mainPhoto21,
                    MonumentType = MonumentType.Park,
                    Name = "Park Westerplatte",
                };

                byte[] mainPhoto22;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "molowgdanskubrzeznie.jpg", FileMode.Open)))
                {
                    mainPhoto22 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument22 = new Monument()
                {
                    Address = "Jantarowa 1",
                    AverageMark = 0M,
                    CityId = gdanskId,
                    CreationDate = "XX wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 54.41414159995145M,
                    Longitude = 18.62492680549622M,
                    MainPhoto = mainPhoto22,
                    MonumentType = MonumentType.Inny,
                    Name = "Molo w Gdańsku Brzeźnie",
                };

                byte[] mainPhoto23;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "zamekkrolewskinawawelu.jpg", FileMode.Open)))
                {
                    mainPhoto23 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument23 = new Monument()
                {
                    Address = "Wawel 5",
                    AverageMark = 0M,
                    CityId = krakowId,
                    CreationDate = "XIV wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 50.05416299720227M,
                    Longitude = 19.936172962188724M,
                    MainPhoto = mainPhoto23,
                    MonumentType = MonumentType.Zamek,
                    Name = "Zamek Królewski na Wawelu",
                };

                byte[] mainPhoto24;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "rynekglownywkrakowie.jpg", FileMode.Open)))
                {
                    mainPhoto24 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument24 = new Monument()
                {
                    Address = "Rynek Główny",
                    AverageMark = 0M,
                    CityId = krakowId,
                    CreationDate = "XV wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 50.06187759823624M,
                    Longitude = 19.93752479553223M,
                    MainPhoto = mainPhoto24,
                    MonumentType = MonumentType.Rynek,
                    Name = "Rynek Głowny w Krakowie",
                };

                byte[] mainPhoto25;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "muzeumlotnictwa.jpg", FileMode.Open)))
                {
                    mainPhoto25 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument25 = new Monument()
                {
                    Address = "Emaus 4",
                    AverageMark = 0M,
                    CityId = krakowId,
                    CreationDate = "XX wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 50.05289547982455M,
                    Longitude = 19.91426467895508M,
                    MainPhoto = mainPhoto25,
                    MonumentType = MonumentType.Muzeum,
                    Name = "Muzeum Lotnictwa w Krakowie",
                };

                byte[] mainPhoto26;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "staryrynekwpoznaniu.jpg", FileMode.Open)))
                {
                    mainPhoto26 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument26 = new Monument()
                {
                    Address = "Stary Rynek",
                    AverageMark = 0M,
                    CityId = poznanId,
                    CreationDate = "XVII wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 52.40828351070694M,
                    Longitude = 16.933579444885257M,
                    MainPhoto = mainPhoto26,
                    MonumentType = MonumentType.Rynek,
                    Name = "Stary Rynek w Poznaniu",
                };

                byte[] mainPhoto27;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "fontannamarsa.jpg", FileMode.Open)))
                {
                    mainPhoto27 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument27 = new Monument()
                {
                    Address = "Stary Rynek",
                    AverageMark = 0M,
                    CityId = poznanId,
                    CreationDate = "XIX wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 52.40874819746811M,
                    Longitude = 16.93298935890198M,
                    MainPhoto = mainPhoto27,
                    MonumentType = MonumentType.Pomnik,
                    Name = "Fontanna Marsa",
                };

                byte[] mainPhoto28;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "rogalowemuzeumpoznania.jpg", FileMode.Open)))
                {
                    mainPhoto28 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument28 = new Monument()
                {
                    Address = "Klasztorna 23",
                    AverageMark = 0M,
                    CityId = poznanId,
                    CreationDate = "1902 rok",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 52.408335870023336M,
                    Longitude = 16.935070753097538M,
                    MainPhoto = mainPhoto28,
                    MonumentType = MonumentType.Muzeum,
                    Name = "Rogalowe Muzeum Poznania",
                };

                byte[] mainPhoto29;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "wielkakrokiew.jpg", FileMode.Open)))
                {
                    mainPhoto29 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument29 = new Monument()
                {
                    Address = "Bronisława Czecha 1",
                    AverageMark = 0M,
                    CityId = zakopaneId,
                    CreationDate = "1923 rok",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = false,
                    Latitude = 49.279424553706534M,
                    Longitude = 19.964046478271488M,
                    MainPhoto = mainPhoto29,
                    MonumentType = MonumentType.Inny,
                    Name = "Wielka krokiew",
                };

                byte[] mainPhoto30;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "kropowki.jpg", FileMode.Open)))
                {
                    mainPhoto30 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument30 = new Monument()
                {
                    Address = "Krupówki",
                    AverageMark = 0M,
                    CityId = zakopaneId,
                    CreationDate = "1923 rok",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 49.295883871502205M,
                    Longitude = 19.956665039062504M,
                    MainPhoto = mainPhoto30,
                    MonumentType = MonumentType.Rynek,
                    Name = "Krupówki w Zakopanem",
                };

                byte[] mainPhoto31;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "gubalowka.jpg", FileMode.Open)))
                {
                    mainPhoto31 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument31 = new Monument()
                {
                    Address = "Droga Zubka",
                    AverageMark = 0M,
                    CityId = zakopaneId,
                    CreationDate = "Nie wiadomo",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 49.306294071633054M,
                    Longitude = 19.93301868438721M,
                    MainPhoto = mainPhoto31,
                    MonumentType = MonumentType.Inny,
                    Name = "Gubałówka",
                };

                byte[] mainPhoto32;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "bydgoskieprzedmiesciewtoruniu.jpg", FileMode.Open)))
                {
                    mainPhoto32 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument32 = new Monument()
                {
                    Address = "Adama Mickiewicza",
                    AverageMark = 0M,
                    CityId = torunId,
                    CreationDate = "XX wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 53.008586419806925M,
                    Longitude = 18.571872711181644M,
                    MainPhoto = mainPhoto32,
                    MonumentType = MonumentType.Inny,
                    Name = "Bydgoskie Przedmieście w Toruniu",
                };

                byte[] mainPhoto33;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "cmentarztorunski.jpg", FileMode.Open)))
                {
                    mainPhoto33 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument33 = new Monument()
                {
                    Address = "Wiejska 33",
                    AverageMark = 0M,
                    CityId = torunId,
                    CreationDate = "XIX wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 53.01669375442384M,
                    Longitude = 18.59667778015137M,
                    MainPhoto = mainPhoto33,
                    MonumentType = MonumentType.Cmentarz,
                    Name = "Cmentarz Toruński",
                };

                byte[] mainPhoto34;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "ryneknowomiejski.jpg", FileMode.Open)))
                {
                    mainPhoto34 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument34 = new Monument()
                {
                    Address = "Prosta 12",
                    AverageMark = 0M,
                    CityId = torunId,
                    CreationDate = "XVII wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 53.011672034000185M,
                    Longitude = 18.611505031585697M,
                    MainPhoto = mainPhoto34,
                    MonumentType = MonumentType.Rynek,
                    Name = "Rynek Nowomiejski w Toruniu",
                };

                byte[] mainPhoto35;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "zamekksiazatpomorskich.jpg", FileMode.Open)))
                {
                    mainPhoto35 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument35 = new Monument()
                {
                    Address = "Korsarzy 34",
                    AverageMark = 0M,
                    CityId = szczecinId,
                    CreationDate = "XVI wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 53.426297197504M,
                    Longitude = 14.560146331787M,
                    MainPhoto = mainPhoto35,
                    MonumentType = MonumentType.Zamek,
                    Name = "Zamek Książąt Pomorskich w Szczecinie",
                };

                byte[] mainPhoto36;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "cmentarzcentralny.jpg", FileMode.Open)))
                {
                    mainPhoto36 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument36 = new Monument()
                {
                    Address = "Ku Słońcu 125A",
                    AverageMark = 0M,
                    CityId = szczecinId,
                    CreationDate = "XX wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 53.415773272268396M,
                    Longitude = 14.516201019287111M,
                    MainPhoto = mainPhoto36,
                    MonumentType = MonumentType.Cmentarz,
                    Name = "Cmentarz Centralny w Szczecinie",
                };

                byte[] mainPhoto37;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "mielewskalaka.jpg", FileMode.Open)))
                {
                    mainPhoto37 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument37 = new Monument()
                {
                    Address = "Jezioro Dąbie",
                    AverageMark = 0M,
                    CityId = szczecinId,
                    CreationDate = "Nie wiadomo",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 53.41966090647586M,
                    Longitude = 14.617481231689453M,
                    MainPhoto = mainPhoto37,
                    MonumentType = MonumentType.Park,
                    Name = "Mielewska Łąka",
                };

                byte[] mainPhoto38;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "wzgorzearkony.jpg", FileMode.Open)))
                {
                    mainPhoto38 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument38 = new Monument()
                {
                    Address = "Arkońska 777",
                    AverageMark = 0M,
                    CityId = szczecinId,
                    CreationDate = "Nie wiadomo",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 53.463832185776624M,
                    Longitude = 14.516887664794924M,
                    MainPhoto = mainPhoto38,
                    MonumentType = MonumentType.Inny,
                    Name = "Wgórze Arkony w Szczecinie",
                };

                byte[] mainPhoto39;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "rynekradomski.jpg", FileMode.Open)))
                {
                    mainPhoto39 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument39 = new Monument()
                {
                    Address = "Rynek Głowny 223",
                    AverageMark = 0M,
                    CityId = radomId,
                    CreationDate = "XXX wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 51.40091918770499M,
                    Longitude = 21.142845153808594M,
                    MainPhoto = mainPhoto39,
                    MonumentType = MonumentType.Rynek,
                    Name = "Rynek Radomski",
                };

                byte[] mainPhoto40;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "borkimateusze.jpg", FileMode.Open)))
                {
                    mainPhoto40 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument40 = new Monument()
                {
                    Address = "Bolesława Limanowskiego",
                    AverageMark = 0M,
                    CityId = radomId,
                    CreationDate = "XX wiek",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 51.38988718803266M,
                    Longitude = 21.12619400024414M,
                    MainPhoto = mainPhoto40,
                    MonumentType = MonumentType.Inny,
                    Name = "Borki Mateusze",
                };

                byte[] mainPhoto41;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "goragor.jpg", FileMode.Open)))
                {
                    mainPhoto41 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument41 = new Monument()
                {
                    Address = "Radomska 17",
                    AverageMark = 0M,
                    CityId = radomId,
                    CreationDate = "1912 rok",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 51.40252556766974M,
                    Longitude = 21.168594360351562M,
                    MainPhoto = mainPhoto41,
                    MonumentType = MonumentType.Inny,
                    Name = "Góra gór",
                };

                byte[] mainPhoto42;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "niezidentyfikowanyportlotniczy.jpg", FileMode.Open)))
                {
                    mainPhoto42 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument42 = new Monument()
                {
                    Address = "Lubelska 158",
                    AverageMark = 0M,
                    CityId = radomId,
                    CreationDate = "2343 rok",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 51.39267221567386M,
                    Longitude = 21.20515823364258M,
                    MainPhoto = mainPhoto42,
                    MonumentType = MonumentType.Inny,
                    Name = "Niezidentyfikowny Port Lotniczy",
                };

                byte[] mainPhoto43;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "staryrynekwewroclawiu.jpg", FileMode.Open)))
                {
                    mainPhoto43 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument43 = new Monument()
                {
                    Address = "Rynek 123",
                    AverageMark = 0M,
                    CityId = wroclawId,
                    CreationDate = "1612 rok",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 51.10993493057241M,
                    Longitude = 17.031469345092777M,
                    MainPhoto = mainPhoto43,
                    MonumentType = MonumentType.Rynek,
                    Name = "Stary Rynek we Wrocławiu",
                };

                byte[] mainPhoto44;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "kosciolswmariimagdalenywewroclawiu.jpg", FileMode.Open)))
                {
                    mainPhoto44 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument44 = new Monument()
                {
                    Address = "Szewska 10",
                    AverageMark = 0M,
                    CityId = wroclawId,
                    CreationDate = "1811 rok",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 51.109485309410516M,
                    Longitude = 17.035068869590763M,
                    MainPhoto = mainPhoto44,
                    MonumentType = MonumentType.Kościół,
                    Name = "Kościół św. Marii Magdaleny we Wrocławiu",
                };

                byte[] mainPhoto45;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "upustklary.jpg", FileMode.Open)))
                {
                    mainPhoto45 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument45 = new Monument()
                {
                    Address = "Wrocławska 4723",
                    AverageMark = 0M,
                    CityId = wroclawId,
                    CreationDate = "1911 rok",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 51.11648172738724M,
                    Longitude = 17.037692070007328M,
                    MainPhoto = mainPhoto45,
                    MonumentType = MonumentType.Inny,
                    Name = "Upust Klary",
                };

                byte[] mainPhoto46;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "parkslowackiego.jpg", FileMode.Open)))
                {
                    mainPhoto46 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument46 = new Monument()
                {
                    Address = "Adresowa 121",
                    AverageMark = 0M,
                    CityId = wroclawId,
                    CreationDate = "Nie wiadomo",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = false,
                    IsVerified = true,
                    Latitude = 51.10955772060474M,
                    Longitude = 17.04558849334717M,
                    MainPhoto = mainPhoto46,
                    MonumentType = MonumentType.Park,
                    Name = "Park Słowackiego we Wrocławiu",
                };

                byte[] mainPhoto47;
                using (var br = new BinaryReader(File.Open(IMAGE_PATH + "ogrodjaponski.jpg", FileMode.Open)))
                {
                    mainPhoto47 = br.ReadBytes((int)br.BaseStream.Length);
                }

                var monument47 = new Monument()
                {
                    Address = "Adama Mickiewicza 1",
                    AverageMark = 0M,
                    CityId = wroclawId,
                    CreationDate = "1933 rok",
                    CreatorId = hajtoId,
                    Description = "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?",
                    IsDue = true,
                    IsVerified = true,
                    Latitude = 51.109759797756006M,
                    Longitude = 17.080017328262333M,
                    MainPhoto = mainPhoto47,
                    MonumentType = MonumentType.Park,
                    Name = "Ogród Japoński",
                };


                db.Monuments.Add(monument1);
                db.Monuments.Add(monument2);
                db.Monuments.Add(monument3);
                db.Monuments.Add(monument4);
                db.Monuments.Add(monument5);
                db.Monuments.Add(monument6);
                db.Monuments.Add(monument7);
                db.Monuments.Add(monument8);
                db.Monuments.Add(monument9);
                db.Monuments.Add(monument10);
                db.Monuments.Add(monument11);
                db.Monuments.Add(monument12);
                db.Monuments.Add(monument13);
                db.Monuments.Add(monument14);
                db.Monuments.Add(monument15);
                db.Monuments.Add(monument16);
                db.Monuments.Add(monument17);
                db.Monuments.Add(monument18);
                db.Monuments.Add(monument19);
                db.Monuments.Add(monument20);
                db.Monuments.Add(monument21);
                db.Monuments.Add(monument22);
                db.Monuments.Add(monument23);
                db.Monuments.Add(monument24);
                db.Monuments.Add(monument25);
                db.Monuments.Add(monument26);
                db.Monuments.Add(monument27);
                db.Monuments.Add(monument28);
                db.Monuments.Add(monument29);
                db.Monuments.Add(monument30);
                db.Monuments.Add(monument31);
                db.Monuments.Add(monument32);
                db.Monuments.Add(monument33);
                db.Monuments.Add(monument34);
                db.Monuments.Add(monument35);
                db.Monuments.Add(monument36);
                db.Monuments.Add(monument37);
                db.Monuments.Add(monument38);
                db.Monuments.Add(monument39);
                db.Monuments.Add(monument40);
                db.Monuments.Add(monument41);
                db.Monuments.Add(monument42);
                db.Monuments.Add(monument43);
                db.Monuments.Add(monument44);
                db.Monuments.Add(monument45);
                db.Monuments.Add(monument46);
                db.Monuments.Add(monument47);

                db.SaveChanges();



                var trip1 = new Trip()
                {
                    CreatorId = adminId,
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque sed, lacinia in, mi. Cras vel lorem. Etiam pellentesque aliquet tellus. Phasellus pharetra nulla ac diam. Quisque semper justo at risus. Donec venenatis, turpis vel hendrerit interdum, dui ligula ultricies purus, sed posuere libero dui id orci. Nam congue, pede vitae dapibus aliquet, elit magna vulputate arcu, vel tempus metus leo non est. Etiam sit amet lectus quis est congue mollis. Phasellus congue lacus eget neque. Phasellus ornare, ante vitae consectetuer consequat, purus sapien ultricies dolor, et mollis pede metus eget nisi. Praesent sodales velit quis augue. Cras suscipit, urna at aliquam rhoncus, urna quam viverra nisi, in interdum massa nibh nec erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque sed, lacinia in, mi. Cras vel lorem. Etiam pellentesque aliquet tellus. Phasellus pharetra nulla ac diam. Quisque semper justo at risus. Donec venenatis, turpis vel hendrerit interdum, dui ligula ultricies purus, sed posuere libero dui id orci. Nam congue, pede vitae dapibus aliquet, elit magna vulputate arcu, vel tempus metus leo non est. Etiam sit amet lectus quis est congue mollis. Phasellus congue lacus eget neque. Phasellus ornare, ante vitae consectetuer consequat, purus sapien ultricies dolor, et mollis pede metus eget nisi. Praesent sodales velit quis augue. Cras suscipit, urna at aliquam rhoncus, urna quam viverra nisi, in interdum massa nibh nec erat.",
                    Name = "Krótka wycieczka po Białymstoku",
                    SightseeingTime = SightseeingTime.Under2h
                };

                var monumentTrip1_1 = new MonumentTrip()
                {
                    Monument = monument1,
                    Position = 1,
                    Trip = trip1
                };

                var monumentTrip1_2 = new MonumentTrip()
                {
                    Monument = monument2,
                    Position = 2,
                    Trip = trip1
                };

                var monumentTrip1_3 = new MonumentTrip()
                {
                    Monument = monument3,
                    Position = 3,
                    Trip = trip1
                };


                var trip2 = new Trip()
                {
                    CreatorId = hajtoId,
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque sed, lacinia in, mi. Cras vel lorem. Etiam pellentesque aliquet tellus. Phasellus pharetra nulla ac diam. Quisque semper justo at risus. Donec venenatis, turpis vel hendrerit interdum, dui ligula ultricies purus, sed posuere libero dui id orci. Nam congue, pede vitae dapibus aliquet, elit magna vulputate arcu, vel tempus metus leo non est. Etiam sit amet lectus quis est congue mollis. Phasellus congue lacus eget neque. Phasellus ornare, ante vitae consectetuer consequat, purus sapien ultricies dolor, et mollis pede metus eget nisi. Praesent sodales velit quis augue. Cras suscipit, urna at aliquam rhoncus, urna quam viverra nisi, in interdum massa nibh nec erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque sed, lacinia in, mi. Cras vel lorem. Etiam pellentesque aliquet tellus. Phasellus pharetra nulla ac diam. Quisque semper justo at risus. Donec venenatis, turpis vel hendrerit interdum, dui ligula ultricies purus, sed posuere libero dui id orci. Nam congue, pede vitae dapibus aliquet, elit magna vulputate arcu, vel tempus metus leo non est. Etiam sit amet lectus quis est congue mollis. Phasellus congue lacus eget neque. Phasellus ornare, ante vitae consectetuer consequat, purus sapien ultricies dolor, et mollis pede metus eget nisi. Praesent sodales velit quis augue. Cras suscipit, urna at aliquam rhoncus, urna quam viverra nisi, in interdum massa nibh nec erat.",
                    Name = "Hajto zaprasza w podróż",
                    SightseeingTime = SightseeingTime._1day
                };

                var monumentTrip2_1 = new MonumentTrip()
                {
                    Monument = monument1,
                    Position = 2,
                    Trip = trip1
                };

                var monumentTrip2_2 = new MonumentTrip()
                {
                    Monument = monument2,
                    Position = 4,
                    Trip = trip1
                };

                var monumentTrip2_3 = new MonumentTrip()
                {
                    Monument = monument3,
                    Position = 6,
                    Trip = trip1
                };

                var monumentTrip2_4 = new MonumentTrip()
                {
                    Monument = monument4,
                    Position = 1,
                    Trip = trip1
                };

                var monumentTrip2_5 = new MonumentTrip()
                {
                    Monument = monument5,
                    Position = 3,
                    Trip = trip1
                };

                var monumentTrip2_6 = new MonumentTrip()
                {
                    Monument = monument6,
                    Position = 5,
                    Trip = trip1
                };


                var trip3 = new Trip()
                {
                    CreatorId = pazdanId,
                    Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque sed, lacinia in, mi. Cras vel lorem. Etiam pellentesque aliquet tellus. Phasellus pharetra nulla ac diam. Quisque semper justo at risus. Donec venenatis, turpis vel hendrerit interdum, dui ligula ultricies purus, sed posuere libero dui id orci. Nam congue, pede vitae dapibus aliquet, elit magna vulputate arcu, vel tempus metus leo non est. Etiam sit amet lectus quis est congue mollis. Phasellus congue lacus eget neque. Phasellus ornare, ante vitae consectetuer consequat, purus sapien ultricies dolor, et mollis pede metus eget nisi. Praesent sodales velit quis augue. Cras suscipit, urna at aliquam rhoncus, urna quam viverra nisi, in interdum massa nibh nec erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque sed, lacinia in, mi. Cras vel lorem. Etiam pellentesque aliquet tellus. Phasellus pharetra nulla ac diam. Quisque semper justo at risus. Donec venenatis, turpis vel hendrerit interdum, dui ligula ultricies purus, sed posuere libero dui id orci. Nam congue, pede vitae dapibus aliquet, elit magna vulputate arcu, vel tempus metus leo non est. Etiam sit amet lectus quis est congue mollis. Phasellus congue lacus eget neque. Phasellus ornare, ante vitae consectetuer consequat, purus sapien ultricies dolor, et mollis pede metus eget nisi. Praesent sodales velit quis augue. Cras suscipit, urna at aliquam rhoncus, urna quam viverra nisi, in interdum massa nibh nec erat.",
                    Name = "Być jak Pazdan",
                    SightseeingTime = SightseeingTime._1week
                };

                var monumentTrip3_1 = new MonumentTrip()
                {
                    Monument = monument1,
                    Position = 1,
                    Trip = trip1
                };

                var monumentTrip3_2 = new MonumentTrip()
                {
                    Monument = monument2,
                    Position = 2,
                    Trip = trip1
                };

                var monumentTrip3_3 = new MonumentTrip()
                {
                    Monument = monument3,
                    Position = 3,
                    Trip = trip1
                };

                var monumentTrip3_4 = new MonumentTrip()
                {
                    Monument = monument4,
                    Position = 4,
                    Trip = trip1
                };

                var monumentTrip3_5 = new MonumentTrip()
                {
                    Monument = monument5,
                    Position = 5,
                    Trip = trip1
                };

                var monumentTrip3_6 = new MonumentTrip()
                {
                    Monument = monument10,
                    Position = 6,
                    Trip = trip1
                };

                var monumentTrip3_7 = new MonumentTrip()
                {
                    Monument = monument11,
                    Position = 7,
                    Trip = trip1
                };

                var monumentTrip3_8 = new MonumentTrip()
                {
                    Monument = monument12,
                    Position = 8,
                    Trip = trip1
                };

                var monumentTrip3_9 = new MonumentTrip()
                {
                    Monument = monument33,
                    Position = 9,
                    Trip = trip1
                };

                var monumentTrip3_10 = new MonumentTrip()
                {
                    Monument = monument34,
                    Position = 10,
                    Trip = trip1
                };

                var monumentTrip3_11 = new MonumentTrip()
                {
                    Monument = monument44,
                    Position = 11,
                    Trip = trip1
                };

                db.Trips.Add(trip1);
                db.Trips.Add(trip2);
                db.Trips.Add(trip3);

                db.SaveChanges();


                db.MonumentsTrips.Add(monumentTrip1_1);
                db.MonumentsTrips.Add(monumentTrip1_2);
                db.MonumentsTrips.Add(monumentTrip1_3);
                db.MonumentsTrips.Add(monumentTrip2_1);
                db.MonumentsTrips.Add(monumentTrip2_2);
                db.MonumentsTrips.Add(monumentTrip2_3);
                db.MonumentsTrips.Add(monumentTrip2_4);
                db.MonumentsTrips.Add(monumentTrip2_5);
                db.MonumentsTrips.Add(monumentTrip2_6);
                db.MonumentsTrips.Add(monumentTrip3_1);
                db.MonumentsTrips.Add(monumentTrip3_2);
                db.MonumentsTrips.Add(monumentTrip3_3);
                db.MonumentsTrips.Add(monumentTrip3_4);
                db.MonumentsTrips.Add(monumentTrip3_5);
                db.MonumentsTrips.Add(monumentTrip3_6);
                db.MonumentsTrips.Add(monumentTrip3_7);
                db.MonumentsTrips.Add(monumentTrip3_8);
                db.MonumentsTrips.Add(monumentTrip3_9);
                db.MonumentsTrips.Add(monumentTrip3_10);
                db.MonumentsTrips.Add(monumentTrip3_11);

                db.SaveChanges();
            }
        }
    }
}
