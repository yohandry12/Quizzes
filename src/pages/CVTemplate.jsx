const SkillBar = ({ skill, level }) => (
  <div className="flex items-center justify-between mb-2">
    <span className="text-xs font-medium text-gray-700 w-20">{skill}</span>
    <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
      <div
        className="bg-black h-2 rounded-full"
        style={{ width: `${level}%` }}
      />
    </div>
  </div>
);

const ExperienceItem = ({
  title,
  company,
  period,
  description,
  bgColor = "bg-green-100",
}) => (
  <div className={`${bgColor} p-4 rounded-lg mb-4`}>
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-bold text-sm text-gray-800">{title}</h3>
      <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
        {period}
      </span>
    </div>
    <p className="text-xs text-gray-600 mb-2 italic">{company}</p>
    <p className="text-xs text-gray-700 leading-relaxed">{description}</p>
  </div>
);

const EducationItem = ({ degree, school, period, description }) => (
  <div className="mb-4">
    <h3 className="font-bold text-sm text-gray-800">{degree}</h3>
    <p className="text-xs text-blue-600 italic">{school}</p>
    <p className="text-xs text-gray-600 font-medium">{period}</p>
    <p className="text-xs text-gray-700 mt-1">{description}</p>
  </div>
);

export default function CVTemplate() {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-white p-8 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-1">
                <span className="font-semibold">P:</span> +123 456 789
              </p>
              <p className="text-xs text-gray-600 mb-1">
                <span className="font-semibold">E:</span> yourname@gmail.com
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold">A:</span> 123, New York, USA
              </p>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Kendra Jones
            </h1>
            <h2 className="text-lg text-gray-700 font-medium">3d & Motion</h2>
            <h2 className="text-lg text-gray-700 font-medium">Designer</h2>
          </div>
          <div className="ml-8">
            <img
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
              alt="Kendra Jones"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
          </div>
        </div>

        <div className="flex">
          {/* Left Column */}
          <div className="w-1/2 p-8">
            {/* Experience */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Experience
              </h2>

              <ExperienceItem
                title="Sr. Motion Designer"
                company="Accenture"
                period="2024-Present"
                description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry."
                bgColor="bg-green-100"
              />

              <ExperienceItem
                title="Motion Designer"
                company="Cisco System"
                period="2023-2024"
                description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                bgColor="bg-blue-100"
              />

              <ExperienceItem
                title="Jr. Motion Designer"
                company="Microsoft"
                period="2021-2022"
                description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
                bgColor="bg-yellow-100"
              />

              <ExperienceItem
                title="Internship"
                company="Alphabet"
                period="2020-2021"
                description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                bgColor="bg-green-100"
              />
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Skills</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <SkillBar skill="Blender" level={85} />
                  <SkillBar skill="After Effects" level={60} />
                  <SkillBar skill="Premier Pro" level={45} />
                </div>
                <div>
                  <SkillBar skill="Maya" level={90} />
                  <SkillBar skill="Photoshop" level={80} />
                  <SkillBar skill="Illustrator" level={50} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-1/2 p-8 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Education</h2>

            <EducationItem
              degree="Diploma in Computer Engi."
              school="University Name 01"
              period="2010-2012"
              description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
            />

            <EducationItem
              degree="Bachelor of Computer Engi."
              school="University Name 02"
              period="2012-2014"
              description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
            />

            <EducationItem
              degree="Master Of Computer Engi."
              school="University Name 03"
              period="2014-2016"
              description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
