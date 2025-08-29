import React from 'react';

const DesignerCV = () => {
  const skills = [
    'PHOTOSHOP', 'ILLUSTRATOR', 'XD', 'AFTER EFFECTS',
    'CREATIVE SUITE', 'SKETCH', 'FIGMA', 'UX DESIGN',
    'PROTOTYPING', 'ANIMATION'
  ];

  const languages = [
    { lang: 'UKRAINIAN', level: 'NATIVE' },
    { lang: 'ENGLISH', level: 'FLUENT' },
    { lang: 'RUSSIAN', level: 'NATIVE' }
  ];

  const workExperience = [
    {
      title: 'WEB & UX-UI DESIGNER',
      company: 'FREELANCE',
      period: '2019 - PRESENT',
      description: 'Creating strategic time design ideas, manageable apps and templates for e-mail marketing campaigns. Web design work UX design. I worked design, development of different part of web sites. Development of mobile applications, landing pages, client websites, business cards from conceptual phases, creativity, design, spacing, wire frame to final PSD. The successful fit Design size. Team member: A important work with clients helps the staff designed'
    },
    {
      title: 'WEB DESIGNER',
      company: 'REMOTE AGENCY',
      period: '2018 - 2019',
      description: 'Start new work. General web designs and presentations.'
    },
    {
      title: 'GRAPHIC DESIGNER',
      company: 'FREELANCE',
      period: '2016 - 2018',
      description: 'My creative designer professional for social networks. Promotional and creative campaigns. Professional design of product catalogs and websites.'
    },
    {
      title: 'GRAPHIC DESIGNER',
      company: 'FREELANCE',
      period: '2013 - 2016',
      description: 'Creation of advertising campaigns, small and medium businesses, inline clients for web development. Development of illustrations, logos, business cards, landing pages, press advertising and design of business by order. Experience working on creative projects in the fashion of prints, banners, UI interfaces, WEB design and social events. Extensive work with a marketing agency - development of visualizations for social networks, video content, creative management.'
    }
  ];

  const interests = [
    {
      title: 'CREATING DESIGN',
      description: 'I can look for original routes inside the world. My creative process always involves the best methods. My main field helps creative synthesis. I have more experience for help me build up the main world that aims to give them a place to exist products.',
      icon: '💻'
    },
    {
      title: 'RUNNING',
      description: 'My body has always been very important to me. Since place to run (championship in the mountains. Nice place to run.',
      icon: '🏃'
    },
    {
      title: 'HIKING',
      description: 'Strength and endurance. Adventure and challenge. I like to challenge my limits and what I can measure. That is why I feel is a balanced island and walked every trials place.',
      icon: '⛰️'
    },
    {
      title: 'READING AND LISTENING BOOKS',
      description: 'I gain with fascinated by classic and information. It gives me calmness and energy for daily routines. It helps me understand different points of view and allows me to build long success for my business.',
      icon: '📚'
    },
    {
      title: 'EXPLORING',
      description: 'I like travelling to new and unknown places with cultural heritage and stunning nature. This is very challenging to explore outdoor experiences, travel technology to see many and different places around the world.',
      icon: '🌍'
    }
  ];

  const socialActivities = [
    {
      title: 'FESTIVALS AND MUSIC EVENTS',
      description: 'Participating in Business Conventions Like Fuze New 2021. Respecting Feel 2020.'
    },
    {
      title: 'BUILDING UKRAINE TOGETHER SHIFT',
      description: 'Volunteer charity. The activities of the organization are aimed at the infrastructural development of the small Ukrainian villages.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Profile Header */}
          <div className="grid grid-cols-2 gap-4">
            {/* Profile Image */}
            <div className="bg-blue-600 rounded-2xl p-6 flex items-center justify-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Title Card */}
            <div className="bg-gray-100 text-black rounded-2xl p-4">
              <div className="text-xs font-bold mb-2">PORTFOLIO</div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-2xl font-bold">BEHANCE</div>
                <div className="text-xl font-bold">Be</div>
              </div>
              <div className="text-blue-600 font-bold text-lg mb-2">WEB & UX/UI DESIGNER</div>
              <div className="text-xs text-gray-600 mb-4">SIMPLE, STYLISH AND LOGICAL.<br/>Make the world better through design.</div>
              <div className="flex justify-between">
                <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs">MORE GRAPHIC</div>
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  SHOTS
                  <span className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-black text-xs">⚪</span>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs inline-block">INSTAGRAM</div>
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs inline-block ml-2">DRIBBBLE</div>
              </div>
            </div>
          </div>

          {/* Name and Contact */}
          <div>
            <h1 className="text-2xl font-bold mb-4">ANDRII KOLODIAZHENSKYI</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                📧 HELLO@ANDRIIKOL.UKRAINE
              </span>
              <span className="bg-gray-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                📱 +38-067-38-XXX-XX
              </span>
              <span className="bg-gray-800 px-3 py-1 rounded-full text-xs">
                📧 ANDRIIKOL@GMAIL.COM
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-800 px-3 py-1 rounded-full text-xs">FACEBOOK</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full text-xs">TELEGRAM</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full text-xs">LINKEDIN</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full text-xs">BEHANCE</span>
            </div>
          </div>

          {/* Profile Section */}
          <div className="bg-blue-600 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold">PROFILE</h2>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600">▶</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              During the time I managed to work with serious design projects. 
              I used to be connected with projects such as landing pages, mobile 
              applications, web applications and social networks design.
              <br/><br/>
              Over 5 years I was as active interviewed in the development front of the design 
              fields as websites, mobile applications, and social networks.
              <br/><br/>
              I like to create thoughtful and user-centered, we research and analyze critically 
              before solving problems and creating design.
              <br/><br/>
              I am detail-oriented, and I can ensure the final solution to project before 
              the first stage. I make sure the product will match the goals and real.
            </p>
          </div>

          {/* Skills Section */}
          <div className="bg-gray-100 text-black rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">SKILLS</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="bg-black text-white px-3 py-1 rounded-full text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Tools Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">TOOLS</h2>
            <div className="space-y-3">
              <div className="bg-blue-600 px-4 py-2 rounded-lg">
                <div className="font-bold text-sm">FIGMA</div>
                <div className="text-xs mt-1">
                  My experience with figma can provide and recommend. However, 
                  these are the tools I use every day, as most of the design...
                </div>
              </div>
              <div className="bg-blue-600 px-4 py-2 rounded-lg">
                <div className="font-bold text-sm">ILLUSTRATOR</div>
                <div className="text-xs mt-1">
                  1. I mostly use illustrator to create UI elements.
                  2. Business I created everything I could, even the first mice.
                </div>
              </div>
              <div className="bg-blue-600 px-4 py-2 rounded-lg">
                <div className="font-bold text-sm">ADOBE XD</div>
                <div className="text-xs mt-1">
                  I have enough skills to process a phone. But I simply love to form.
                </div>
              </div>
              <div className="bg-blue-600 px-4 py-2 rounded-lg">
                <div className="font-bold text-sm">PHOTOSHOP</div>
                <div className="text-xs mt-1">
                  My software and work more advanced than Figma.
                  However, I frequently I use create a design task as well.
                </div>
              </div>
            </div>
          </div>

          {/* Languages Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">LANGUAGES</h2>
            <div className="space-y-2">
              {languages.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="bg-blue-600 px-3 py-1 rounded text-sm">{item.lang}</span>
                  <span className="text-sm">{item.level}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400">
              MY UPPER INTERMEDIATE.<br/>
              CAN READ ANY TASK, SPEAK FLUENT & MISTAKES.
            </div>
            <div className="bg-blue-600 px-3 py-1 rounded inline-block text-sm">
              RUSSIAN VERY WELL BUT I CAN SPEAK.
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Work Experience */}
          <div>
            <h2 className="text-2xl font-bold mb-6">WORK EXPERIENCE</h2>
            <div className="space-y-4">
              {workExperience.map((job, index) => (
                <div key={index} className="bg-white text-black rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{job.title}</h3>
                    <span className="text-sm text-gray-600">{job.period}</span>
                  </div>
                  <div className="font-semibold text-blue-600 mb-3">{job.company}</div>
                  <p className="text-sm leading-relaxed">{job.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education */}
            <div>
              <h2 className="text-2xl font-bold mb-4">EDUCATION</h2>
              <div className="space-y-4">
                <div className="bg-white text-black rounded-2xl p-4">
                  <h3 className="font-bold">IVAN FRANKO STATE UNIVERSITY</h3>
                  <div className="text-blue-600 font-semibold">BACHELOR DEGREE</div>
                  <div className="text-sm text-gray-600 mt-2">2011 - 2015</div>
                  <div className="flex gap-2 mt-3">
                    <span className="bg-black text-white px-2 py-1 rounded text-xs">DESIGN</span>
                    <span className="bg-black text-white px-2 py-1 rounded text-xs">DEVELOPMENT</span>
                    <span className="bg-black text-white px-2 py-1 rounded text-xs">CREATIVE</span>
                    <span className="bg-black text-white px-2 py-1 rounded text-xs">AGENCY</span>
                  </div>
                </div>
                
                <div className="bg-white text-black rounded-2xl p-4">
                  <h3 className="font-bold">ZHADI XTU</h3>
                  <div className="text-blue-600 font-semibold">MASTER DEGREE</div>
                  <div className="text-sm mt-2">Systems Architecture and Social Design (MA).<br/>
                  Professional development and social</div>
                  <div className="text-sm text-gray-600 mt-2">2015 - 2017</div>
                  <div className="flex gap-2 mt-3">
                    <span className="bg-black text-white px-2 py-1 rounded text-xs">SYSTEMS</span>
                    <span className="bg-black text-white px-2 py-1 rounded text-xs">ARCHITECTURE</span>
                    <span className="bg-black text-white px-2 py-1 rounded text-xs">SOCIAL</span>
                    <span className="bg-black text-white px-2 py-1 rounded text-xs">DEVELOPMENT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses */}
            <div>
              <h2 className="text-2xl font-bold mb-4">COURSES</h2>
              <div className="space-y-3">
                <div className="bg-gray-100 text-black rounded-xl p-4">
                  <h3 className="font-bold">CREATIVE PRACTICE</h3>
                  <div className="text-sm text-blue-600">UI UX DESIGN</div>
                </div>
                <div className="bg-gray-100 text-black rounded-xl p-4">
                  <h3 className="font-bold">CREATIVE PRACTICE</h3>
                  <div className="text-sm text-blue-600">UI UX DESIGN</div>
                </div>
                <div className="bg-gray-100 text-black rounded-xl p-4">
                  <h3 className="font-bold">GENUS</h3>
                  <div className="text-sm text-blue-600">UX DESIGN</div>
                </div>
                <div className="bg-gray-100 text-black rounded-xl p-4">
                  <h3 className="font-bold">UDCHI</h3>
                  <div className="text-sm text-blue-600">UX GRAPHIC DESIGN</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <h2 className="text-2xl font-bold mb-6">INTERESTS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interests.map((interest, index) => (
                <div key={index} className="bg-white text-black rounded-2xl p-6 relative">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-3">{interest.title}</h3>
                      <p className="text-sm leading-relaxed">{interest.description}</p>
                    </div>
                    <div className="text-4xl">{interest.icon}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Activities */}
          <div>
            <h2 className="text-2xl font-bold mb-6">SOCIAL ACTIVITIES</h2>
            <div className="space-y-4">
              {socialActivities.map((activity, index) => (
                <div key={index} className="bg-white text-black rounded-2xl p-6 relative">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-3">{activity.title}</h3>
                      <p className="text-sm leading-relaxed">{activity.description}</p>
                    </div>
                    <div className="text-4xl">🎯</div>
                  </div>
                </div>
              ))}
              
              <div className="bg-white text-black rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-3">LANGUAGES</h3>
                <div className="flex gap-2 mb-3">
                  <span className="bg-black text-white px-3 py-1 rounded text-sm">HTML</span>
                  <span className="bg-black text-white px-3 py-1 rounded text-sm">CSS</span>
                  <span className="bg-black text-white px-3 py-1 rounded text-sm">JS</span>
                  <span className="bg-black text-white px-3 py-1 rounded text-sm">REACT</span>
                </div>
              </div>

              <div className="bg-white text-black rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-3">TRAININGS CVS</h3>
              </div>

              <div className="bg-white text-black rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-3">EDUCATION PROJECTS & CAMPS</h3>
                <p className="text-sm leading-relaxed">
                  My life includes a large number of different projects in which I have participated 
                  as a volunteer and in which I gave my time for important or meaningful projects 
                  such as the project "Yumping Game Projects" and various camps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="text-center mt-12">
        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-bold transition-colors">
          DON'T TOUCH
        </button>
      </div>
    </div>
  );
};

export default DesignerCV;